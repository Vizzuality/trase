require "#{Rails.root}/lib/modules/cache/warmer.rb"
require "#{Rails.root}/lib/modules/cache/cleaner.rb"

module Api
  module V3
    module Import
      class Importer
        include Api::V3::Import::Tables

        def initialize(database_update, source_schema)
          @database_update = database_update
          @source_schema = source_schema
          @stats = Api::V3::Import::Stats.new(database_update.stats)
          @stats.update_key('elapsed_seconds', {})
        end

        def call
          Api::V3::BaseModel.transaction do
            backup
            import
          end
          yield if block_given?
          refresh_materialized_views_now
          Cache::Cleaner.clear_all
          Cache::Warmer::UrlsFile.generate
          refresh_precomputed_downloads_later
          refresh_attributes_years
          @database_update.finished_with_success(@stats.to_h)
        rescue => e
          @database_update.finished_with_error(e, @stats.to_h)
          raise # re-raise same error
        end

        private

        def backup
          ALL_TABLES.each do |table|
            table_class = table[:table_class]
            yellow_tables = table[:yellow_tables]
            table_class.key_backup(@source_schema)
            @stats.update_blue_table_before(table_class, table_class.count)
            next unless yellow_tables

            yellow_tables.each do |yellow_table_class|
              yellow_table_class.full_backup
              @stats.update_yellow_table_before(
                yellow_table_class, yellow_table_class.count
              )
            end
          end
        end

        def import
          ALL_TABLES.each do |table|
            table_class = table[:table_class]
            yellow_tables = table[:yellow_tables]

            # replace data in the blue table
            blue_table_cnt = ReplaceBlueTable.new(
              table_class, @source_schema
            ).call
            @stats.update_blue_table_after(table_class, blue_table_cnt)
            next unless yellow_tables

            # restore dependent yellow tables
            yellow_tables.each do |yellow_table_class|
              yellow_table_cnt = RestoreYellowTable.new(
                yellow_table_class
              ).call
              if yellow_table_class == Api::V3::NodeProperty
                Api::V3::NodeProperty.insert_missing_node_properties
                yellow_table_cnt = Api::V3::NodeProperty.count
              end
              @stats.update_yellow_table_after(
                yellow_table_class, yellow_table_cnt
              )
            end
          end
          destroy_zombies
        end

        # An example of how a zombie can be created by the import process:
        # 1. backup xxx_inds/quals/quants and xxx_attributes (yellow)
        # 2. import and replace inds/quals/quants (blue)
        # 3. restore xxx_attributes (note: this restores all the backed up
        #    records, because at this point we don't know if any of them are
        #    no longer needed)
        # 4. restore xxx_inds/quals/quants (note: this only restores backed up
        #    records with a match in both inds/quals/quants and xxx_attributes)
        # 5. at this point it is possible to have xxx_attributes which are not
        # referenced anywhere. These zombies should be deleted.
        def destroy_zombies
          TABLES_TO_CHECK_FOR_ZOMBIES.each do |table_class|
            cnt_before = table_class.count
            table_class.destroy_zombies
            cnt_after = table_class.count
            next unless cnt_after != cnt_before

            @stats.update_yellow_table_after(table_class, cnt_after)
          end
        end

        def refresh_materialized_views_now
          # synchronously, with dependencies
          [
            Api::V3::Readonly::Context,
            Api::V3::Readonly::Attribute,
            Api::V3::Readonly::Flow, # TODO: try to get rid of this one
            Api::V3::Readonly::FlowNode,
            Api::V3::Readonly::NodeWithFlowsPerYear
          ].each { |mview| mview.refresh(sync: true, skip_dependents: true) }
          Api::V3::TablePartitions::CreatePartitionsForFlows.new.call
          Api::V3::TablePartitions::CreatePartitionsForFlowQuants.new.call
          Api::V3::TablePartitions::CreatePartitionsForFlowInds.new.call
          Api::V3::TablePartitions::CreatePartitionsForFlowQuals.new.call
          Api::V3::Readonly::DownloadFlow.refresh(
            sync: true, skip_dependents: true, skip_precompute: true
          )
          Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuants.new.call
          Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowInds.new.call
          Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuals.new.call
          # synchronously, skip dependencies (already refreshed)
          [
            Api::V3::Readonly::NodeWithFlows,
            Api::V3::Readonly::NodeWithFlowsOrGeo,
            Api::V3::Readonly::NodesStats,
            Api::V3::Readonly::ChartAttribute,
            Api::V3::Readonly::DashboardsAttribute,
            Api::V3::Readonly::DownloadAttribute,
            Api::V3::Readonly::MapAttribute,
            Api::V3::Readonly::RecolorByAttribute,
            Api::V3::Readonly::ResizeByAttribute,
            Api::V3::Readonly::Dashboards::Commodity,
            Api::V3::Readonly::Dashboards::Country,
            Api::V3::Readonly::NodesPerContextRankedByVolumePerYear,
            Api::V3::Readonly::Dashboards::Source,
            # TODO: remove once dashboards_companies_mv retired
            Api::V3::Readonly::Dashboards::Company,
            Api::V3::Readonly::Dashboards::Exporter,
            Api::V3::Readonly::Dashboards::Importer,
            Api::V3::Readonly::Dashboards::Destination,
            Api::V3::Readonly::ContextAttributeProperty,
            Api::V3::Readonly::CountryAttributeProperty,
            Api::V3::Readonly::CommodityAttributeProperty,
            Api::V3::Readonly::QuantValuesMeta,
            Api::V3::Readonly::IndValuesMeta,
            Api::V3::Readonly::QualValuesMeta,
            Api::V3::Readonly::FlowQuantTotal
          ].each { |mview| mview.refresh(sync: true, skip_dependencies: true) }
        end

        def refresh_precomputed_downloads_later
          Api::V3::Download::PrecomputedDownload.refresh_later
        end

        def refresh_attributes_years
          TABLES_TO_REFRESH_YEARS.each do |table_class|
            table_class.all.each { |ra| ra.send(:set_years) }
          end
        end
      end
    end
  end
end
