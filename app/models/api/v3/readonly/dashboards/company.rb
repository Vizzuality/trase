# == Schema Information
#
# Table name: dashboards_companies_mv
#
#  id           :integer          primary key
#  name         :text
#  node_type_id :integer
#  node_type    :text
#  flow_id      :integer
#
# Indexes
#
#  index_dashboards_companies_mv_on_flow_id                    (flow_id)
#  index_dashboards_companies_mv_on_flow_id_and_id             (flow_id,id) UNIQUE
#  index_dashboards_companies_mv_on_id_and_name_and_node_type  (id,name,node_type)
#

module Api
  module V3
    module Readonly
      module Dashboards
        class Company < Api::V3::Readonly::BaseModel
          include Refresh

          self.table_name = 'dashboards_companies_mv'
          belongs_to :node
        end
      end
    end
  end
end
