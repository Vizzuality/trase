# == Schema Information
#
# Table name: dashboards_node_attributes_mv
#
#  node_id                       :integer
#  attribute_id                  :integer
#  display_name                  :text
#  tooltip_text                  :text
#  chart_type                    :string
#  dashboards_attribute_group_id :integer
#  position                      :integer
#
# Indexes
#
#  dashboards_node_attributes_mv_node_id_attribute_id_idx  (node_id,attribute_id) UNIQUE
#

module Api
  module V3
    module Readonly
      module Dashboards
        class NodeAttribute < Api::V3::Readonly::BaseModel
          self.table_name = 'dashboards_node_attributes_mv'

          def self.long_running?
            true
          end
        end
      end
    end
  end
end
