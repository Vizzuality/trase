# == Schema Information
#
# Table name: dashboards_countries_mv
#
#  id      :integer          primary key
#  name    :text
#  iso2    :text
#  flow_id :integer
#
# Indexes
#
#  index_dashboards_countries_mv_on_flow_id      (flow_id) UNIQUE
#  index_dashboards_countries_mv_on_id_and_name  (id,name)
#

module Api
  module V3
    module Readonly
      module Dashboards
        class Country < Api::V3::Readonly::BaseModel
          include Refresh

          self.table_name = 'dashboards_countries_mv'
          belongs_to :country
        end
      end
    end
  end
end
