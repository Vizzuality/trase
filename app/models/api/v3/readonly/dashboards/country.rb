# == Schema Information
#
# Table name: dashboards_countries_mv
#
#  id            :integer          primary key
#  name          :text
#  name_tsvector :tsvector
#  iso2          :text
#  commodity_id  :integer
#  node_id       :integer
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
