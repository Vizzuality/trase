# == Schema Information
#
# Table name: dashboards_flow_paths_mv
#
#  context_id      :integer
#  country_id      :integer
#  commodity_id    :integer
#  node_id         :integer
#  node            :text
#  node_type_id    :integer
#  node_type       :text
#  flow_id         :integer
#  column_position :integer
#  role            :string
#  category        :string
#
# Indexes
#
#  dashboards_flow_paths_mv_category_idx         (category)
#  dashboards_flow_paths_mv_flow_id_node_id_idx  (flow_id,node_id) UNIQUE
#

module Api
  module V3
    module Readonly
      module Dashboards
        class FlowPath < Api::V3::Readonly::BaseModel
          self.table_name = 'dashboards_flow_paths_mv'

          def self.refresh_dependents(options = {})
            [
              Api::V3::Readonly::Dashboards::FlowAttribute,
              Api::V3::Readonly::Dashboards::NodeAttribute
            ].each do |mview_klass|
              mview_klass.refresh(options.merge(skip_dependencies: true))
            end
          end

          def self.long_running?
            true
          end
        end
      end
    end
  end
end
