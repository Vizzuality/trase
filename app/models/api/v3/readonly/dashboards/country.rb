# == Schema Information
#
# Table name: dashboards_countries
#
#  id(id of sourcing country (not unique))                                        :integer          not null, primary key
#  commodity_id(id of commodity sourced from this country)                        :integer          not null
#  node_id(id of node, through which this commodity is sourced from this country) :integer          not null
#  context_node_type_id                                                           :integer
#  year                                                                           :integer          not null
#  iso2                                                                           :text
#  name                                                                           :text
#  name_tsvector                                                                  :tsvector
#  profile                                                                        :text
#
# Indexes
#
#  dashboards_countries_commodity_id_idx   (commodity_id)
#  dashboards_countries_name_tsvector_idx  (name_tsvector)
#  dashboards_countries_node_id_idx        (node_id)
#
module Api
  module V3
    module Readonly
      module Dashboards
        class Country < Api::Readonly::BaseModel
          include Api::V3::Readonly::MaterialisedTable

          self.table_name = "dashboards_countries"
          belongs_to :country

          INDEXES = [
            {columns: :commodity_id},
            {columns: :node_id},
            {columns: :name_tsvector, using: :gin}
          ].freeze

          def self.key_translations
            {
              context_id: -> (key_value) {
                context = Api::V3::Context.find(key_value)
                {
                  id: context.country_id,
                  commodity_id: context.commodity_id
                }
              }
            }
          end
        end
      end
    end
  end
end
