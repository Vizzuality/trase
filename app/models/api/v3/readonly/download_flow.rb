# == Schema Information
#
# Table name: download_flows_mv
#
#  id                       :integer          primary key
#  context_id               :integer
#  year                     :integer
#  name_0                   :text
#  name_1                   :text
#  name_2                   :text
#  name_3                   :text
#  name_4                   :text
#  name_5                   :text
#  name_6                   :text
#  name_7                   :text
#  node_id_0                :integer
#  node_id_1                :integer
#  node_id_2                :integer
#  node_id_3                :integer
#  node_id_4                :integer
#  node_id_5                :integer
#  node_id_6                :integer
#  node_id_7                :integer
#  exporter_node_id         :integer
#  importer_node_id         :integer
#  country_node_id          :integer
#  attribute_type           :text
#  attribute_id             :integer
#  attribute_name           :text
#  attribute_name_with_unit :text
#  display_name             :text
#  bool_and                 :boolean
#  sum                      :float
#  total                    :text
#
# Indexes
#
#  index_download_flows_mv_on_attribute_type_and_attribute_id  (attribute_type,attribute_id)
#  index_download_flows_mv_on_country_node_id                  (country_node_id)
#  index_download_flows_mv_on_exporter_node_id                 (exporter_node_id)
#  index_download_flows_mv_on_importer_node_id                 (importer_node_id)
#

module Api
  module V3
    module Readonly
      class DownloadFlow < Api::V3::Readonly::BaseModel
        self.table_name = 'download_flows_mv'
        self.primary_key = 'id'

        def self.refresh(options = {})
          unless options[:skip_flow_paths]
            Scenic.database.refresh_materialized_view(
              'flow_paths_mv', concurrently: false
            )
          end
          Scenic.database.refresh_materialized_view(table_name, concurrently: false)
        end

        # this materialized view takes a long time to refresh
        def self.refresh_later(options = {})
          DownloadFlowsRefreshWorker.perform_async(options)
        end
      end
    end
  end
end
