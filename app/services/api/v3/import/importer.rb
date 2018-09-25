require 'db_helpers/search_path_helpers'
require "#{Rails.root}/lib/modules/cache/warmer.rb"
require "#{Rails.root}/lib/modules/cache/cleaner.rb"

module Api
  module V3
    module Import
      class Importer
        include SearchPathHelpers

        # order matters a lot in here
        ALL_TABLES = [
          {table_class: Api::V3::Country, yellow_tables: [Api::V3::CountryProperty]},
          {table_class: Api::V3::Commodity},
          {
            table_class: Api::V3::Context,
            yellow_tables: [
              Api::V3::ContextProperty,
              Api::V3::ContextualLayer,
              Api::V3::CartoLayer,
              Api::V3::DownloadAttribute,
              Api::V3::MapAttributeGroup,
              Api::V3::MapAttribute,
              Api::V3::RecolorByAttribute,
              Api::V3::ResizeByAttribute
            ]
          },
          {table_class: Api::V3::NodeType},
          {
            table_class: Api::V3::ContextNodeType,
            yellow_tables: [
              Api::V3::ContextNodeTypeProperty,
              Api::V3::Profile,
              Api::V3::Chart,
              Api::V3::ChartAttribute
            ]
          },
          {table_class: Api::V3::DownloadVersion},
          {table_class: Api::V3::Node, yellow_tables: [Api::V3::NodeProperty]},
          {
            table_class: Api::V3::Ind,
            yellow_tables: [
              Api::V3::IndProperty,
              Api::V3::MapInd,
              Api::V3::ChartInd,
              Api::V3::RecolorByInd
            ]
          },
          {table_class: Api::V3::NodeInd},
          {
            table_class: Api::V3::Qual,
            yellow_tables: [
              Api::V3::QualProperty,
              Api::V3::DownloadQual,
              Api::V3::ChartQual,
              Api::V3::RecolorByQual
            ]
          },
          {table_class: Api::V3::NodeQual},
          {
            table_class: Api::V3::Quant,
            yellow_tables: [
              Api::V3::QuantProperty,
              Api::V3::DownloadQuant,
              Api::V3::MapQuant,
              Api::V3::ChartQuant,
              Api::V3::ResizeByQuant
            ]
          },
          {table_class: Api::V3::NodeQuant},
          {table_class: Api::V3::Flow},
          {table_class: Api::V3::FlowInd},
          {table_class: Api::V3::FlowQual},
          {table_class: Api::V3::FlowQuant}
        ].freeze

        def call(database_update)
          @database_update = database_update
          Api::V3::BaseModel.transaction do
            with_search_path(ENV['TRASE_LOCAL_SCHEMA']) do
              backup
              import
              database_update.update_attribute(
                :status, Api::V3::DatabaseUpdate::FINISHED
              )
            end
          end
          refresh_mviews
          Cache::Cleaner.clear_all
          Cache::Warmer::UrlsFile.generate
        rescue => e
          database_update.update_attribute(:status, Api::V3::DatabaseUpdate::FAILED)
          database_update.update_attribute(:error, e.message)
          raise # re-raise same error
        end

        private

        def backup
          @stats = {}
          ALL_TABLES.each do |table|
            table_class = table[:table_class]
            yellow_tables = table[:yellow_tables]
            table_class.key_backup
            @stats[table_class.table_name] = {before: table_class.count}
            next unless yellow_tables

            yellow_table_stats = {}
            yellow_tables.each do |yellow_table_class|
              yellow_table_class.full_backup
              yellow_table_stats[yellow_table_class.table_name] = {before: yellow_table_class.count}
            end
            @stats[table_class.table_name][:yellow_tables] = yellow_table_stats
          end
        end

        def import
          ALL_TABLES.each do |table|
            table_class = table[:table_class]
            yellow_tables = table[:yellow_tables]

            # replace data in the blue table
            blue_table_cnt = ReplaceBlueTable.new(table_class).call
            @stats[table_class.table_name][:after] = blue_table_cnt
            next unless yellow_tables

            # restore dependent yellow tables
            yellow_tables.each do |yellow_table_class|
              yellow_table_cnt = RestoreYellowTable.new(yellow_table_class).call
              if yellow_table_class == Api::V3::NodeProperty
                Api::V3::NodeProperty.insert_missing_node_properties
              end
              @stats[table_class.table_name][:yellow_tables][yellow_table_class.table_name][:after] = yellow_table_cnt
            end
          end
          @database_update.update_attribute(:stats, @stats)
          @stats
        end

        def count_table(table)
          result = ActiveRecord::Base.connection.execute(
            "SELECT COUNT(*) FROM #{table}"
          )
          result.getvalue(0, 0)
        end

        def refresh_mviews
          [
            Api::V3::Readonly::Attribute,
            Api::V3::Readonly::DownloadAttribute,
            Api::V3::Readonly::MapAttribute,
            Api::V3::Readonly::RecolorByAttribute,
            Api::V3::Readonly::ResizeByAttribute,
            Api::V3::Readonly::Node,
            Api::V3::Readonly::DownloadFlow
          ].each(&:refresh)
        end
      end
    end
  end
end
