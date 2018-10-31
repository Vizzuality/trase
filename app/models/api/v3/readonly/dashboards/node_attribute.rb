# == Schema Information
#
# Table name: dashboards_node_attributes_mv
#
#  node_id                       :integer
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
        class NodeAttribute < Api::V3::Readonly::BaseModel
          self.table_name = 'dashboards_node_attributes_mv'

          def self.unique_index?
            false
          end

          def self.long_running?
            true
          end
        end
      end
    end
  end
end
