# == Schema Information
#
# Table name: dashboards_flow_attributes_mv
#
#  country_id                    :integer
#  commodity_id                  :integer
#  path                          :integer          is an Array
#  attribute_id                  :bigint(8)
#  display_name                  :text
#  tooltip_text                  :text
#  chart_type                    :string
#  dashboards_attribute_group_id :bigint(8)
#  position                      :integer
#
# Indexes
#
#  dashboards_flow_attributes_mv_commodity_id_idx              (commodity_id)
#  dashboards_flow_attributes_mv_country_id_idx                (country_id)
#  dashboards_flow_attributes_mv_path_idx                      (path) USING gist
#  dashboards_flow_attributes_mv_unique_attr_flow_context_idx  (attribute_id,path,commodity_id,country_id) UNIQUE
#

module Api
  module V3
    module Readonly
      module Dashboards
        class FlowAttribute < Api::V3::Readonly::BaseModel
          self.table_name = 'dashboards_flow_attributes_mv'

          def self.long_running?
            true
          end
        end
      end
    end
  end
end
