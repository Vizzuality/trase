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
          @stats = database_update.stats || {}
          @stats[:elapsed_seconds] = {}
        end

        def call
          Api::V3::BaseModel.transaction do
            backup
            import
            @database_update.finished_with_success(@stats)
          end
          refresh
          Cache::Cleaner.clear_all
          Cache::Warmer::UrlsFile.generate
        rescue => e
          @database_update.finished_with_error(e, @stats)
          raise # re-raise same error
        end

        private

        def backup
          ALL_TABLES.each do |table|
            table_class = table[:table_class]
            yellow_tables = table[:yellow_tables]
            table_class.key_backup(@source_schema)
            @stats[table_class.table_name] = {'before' => table_class.count}
            next unless yellow_tables

            yellow_table_stats = {}
            yellow_tables.each do |yellow_table_class|
              yellow_table_class.full_backup
              yellow_table_stats[yellow_table_class.table_name] = {
                'before' => yellow_table_class.count
              }
            end
            @stats[table_class.table_name]['yellow_tables'] =
              yellow_table_stats
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
            @stats[table_class.table_name]['after'] = blue_table_cnt
            next unless yellow_tables

            # restore dependent yellow tables
            yellow_table_stats = {}
            yellow_tables.each do |yellow_table_class|
              yellow_table_cnt = RestoreYellowTable.new(
                yellow_table_class
              ).call
              if yellow_table_class == Api::V3::NodeProperty
                Api::V3::NodeProperty.insert_missing_node_properties
                yellow_table_cnt = Api::V3::NodeProperty.count
              end
              yellow_table_stats[yellow_table_class.table_name] = {
                'after' => yellow_table_cnt
              }
            end
            @stats[table_class.table_name]['yellow_tables'] =
              @stats[table_class.table_name]['yellow_tables'].merge(
                yellow_table_stats
              )
          end
          destroy_widows
        end

        # An example of how a widow can be created by the import process:
        # 1. backup xxx_inds/quals/quants and xxx_attributes (yellow)
        # 2. import and replace inds/quals/quants (blue)
        # 3. restore xxx_attributes (note: this restores all the backed up
        #    records, because at this point we don't know if any of them are
        #    no longer needed)
        # 4. restore xxx_inds/quals/quants (note: this only restores backed up
        #    records with a match in both inds/quals/quants and xxx_attributes)
        # 5. at this point it is possible to have xxx_attributes which are not
        # referenced anywhere. These widows should be deleted.
        def destroy_widows
          TABLES_TO_CHECK_FOR_WIDOWS.each do |table_class|
            cnt_before = table_class.count
            table_class.destroy_widows
            cnt_after = table_class.count
            next unless cnt_after != cnt_before

            update_yellow_table_stats_after(table_class, cnt_after)
          end
        end

        def update_yellow_table_stats_after(table_class, cnt_after)
          table_name = table_class.table_name
          blue_table_name = ALL_TABLES.find do |table|
            blue_table_class = table[:table_class]
            yellow_tables = table[:yellow_tables]
            next false unless yellow_tables

            match = yellow_tables.find do |yellow_table_class|
              yellow_table_class == table_class
            end
            next false unless match

            blue_table_class.table_name
          end
          unless blue_table_name &&
              @stats.dig(blue_table_name, 'yellow_tables', table_name)
            return
          end

          @stats[blue_table_name]['yellow_tables'][table_name]['after'] =
            cnt_after
        end

        def refresh
          # synchronously, with dependencies
          [
            Api::V3::Readonly::Attribute,
            Api::V3::Readonly::Node,
            Api::V3::Readonly::DownloadFlow,
            Api::V3::Readonly::Dashboards::FlowPath
          ].each { |mview| mview.refresh(sync: true, skip_dependents: true) }
          # synchronously, skip dependencies (already refreshed)
          [
            Api::V3::Readonly::ChartAttribute,
            Api::V3::Readonly::DownloadAttribute,
            Api::V3::Readonly::MapAttribute,
            Api::V3::Readonly::RecolorByAttribute,
            Api::V3::Readonly::ResizeByAttribute,
            Api::V3::Readonly::DashboardsAttribute,
            Api::V3::Readonly::Dashboards::Commodity,
            Api::V3::Readonly::Dashboards::Country,
            Api::V3::Readonly::Dashboards::Source,
            Api::V3::Readonly::Dashboards::Company,
            Api::V3::Readonly::Dashboards::Destination
          ].each { |mview| mview.refresh(sync: true, skip_dependencies: true) }
        end
      end
    end
  end
end
