# == Schema Information
#
# Table name: dashboards_flow_paths_mv
#
#  context_id   :integer
#  country_id   :integer
#  commodity_id :integer
#  node_id      :integer
#  flow_id      :integer
#
# Indexes
#
#  index_dashboards_flow_paths_mv_on_commodity_id         (commodity_id)
#  index_dashboards_flow_paths_mv_on_country_id           (country_id)
#  index_dashboards_flow_paths_mv_on_flow_id              (flow_id)
#  index_dashboards_flow_paths_mv_on_flow_id_and_node_id  (flow_id,node_id) UNIQUE
#  index_dashboards_flow_paths_mv_on_node_id              (node_id)
#

module Api
  module V3
    module Readonly
      module Dashboards
        class FlowPath < Api::V3::Readonly::BaseModel
          self.table_name = 'dashboards_flow_paths_mv'
        end
      end
    end
  end
end
