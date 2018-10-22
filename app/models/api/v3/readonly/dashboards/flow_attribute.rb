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
