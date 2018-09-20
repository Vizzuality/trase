# == Schema Information
#
# Table name: dashboards_commodities_mv
#
#  id      :integer          primary key
#  name    :text
#  flow_id :integer
#
# Indexes
#
#  index_dashboards_commodities_mv_on_flow_id      (flow_id) UNIQUE
#  index_dashboards_commodities_mv_on_id_and_name  (id,name)
#

module Api
  module V3
    module Readonly
      module Dashboards
        class Commodity < Api::V3::Readonly::BaseModel
          include Refresh

          self.table_name = 'dashboards_commodities_mv'
          belongs_to :commodity
        end
      end
    end
  end
end
