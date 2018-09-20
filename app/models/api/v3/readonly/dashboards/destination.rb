# == Schema Information
#
# Table name: dashboards_destinations_mv
#
#  id           :integer          primary key
#  name         :text
#  node_type_id :integer
#  node_type    :text
#  flow_id      :integer
#
# Indexes
#
#  index_dashboards_destinations_mv_on_flow_id                    (flow_id)
#  index_dashboards_destinations_mv_on_flow_id_and_id             (flow_id,id) UNIQUE
#  index_dashboards_destinations_mv_on_id_and_name_and_node_type  (id,name,node_type)
#

module Api
  module V3
    module Readonly
      module Dashboards
        class Destination < Api::V3::Readonly::BaseModel
          self.table_name = 'dashboards_destinations_mv'
          belongs_to :node

          def self.refresh(options = {})
            FlowPath.refresh unless options[:skip_flow_paths]
            Scenic.database.refresh_materialized_view(table_name, concurrently: false)
          end
        end
      end
    end
  end
end
