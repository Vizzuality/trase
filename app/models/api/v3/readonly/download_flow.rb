# == Schema Information
#
# Table name: download_flows_mv
#
#  row_name                 :integer          is an Array
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
#  download_flows_mv_attribute_type_attribute_id_id_idx        (attribute_type,attribute_id,id) UNIQUE
#  download_flows_mv_context_id_idx                            (context_id)
#  download_flows_mv_country_node_id_idx                       (country_node_id)
#  download_flows_mv_exporter_node_id_idx                      (exporter_node_id)
#  download_flows_mv_importer_node_id_idx                      (importer_node_id)
#  download_flows_mv_row_name_attribute_type_attribute_id_idx  (row_name,attribute_type,attribute_id) UNIQUE
#

module Api
  module V3
    module Readonly
      class DownloadFlow < Api::V3::Readonly::BaseModel
        self.table_name = 'download_flows_mv'
        self.primary_key = 'id'

        def self.refresh_dependencies(_options = {})
          refresh_by_name('flow_paths_mv', concurrently: false) # no unique index
        end
      end
    end
  end
end
