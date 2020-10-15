# == Schema Information
#
# Table name: dashboards_companies
#
#  id                   :integer          not null, primary key
#  node_type_id         :integer
#  context_id           :integer
#  country_id           :integer          not null
#  commodity_id         :integer          not null
#  context_node_type_id :integer
#  year                 :integer          not null
#  name                 :text
#  name_tsvector        :tsvector
#  node_type            :text
#  profile              :text
#  rank_by_year         :jsonb
#
# Indexes
#
#  dashboards_companies_commodity_id_idx   (commodity_id)
#  dashboards_companies_country_id_idx     (country_id)
#  dashboards_companies_name_tsvector_idx  (name_tsvector)
#  dashboards_companies_node_type_id_idx   (node_type_id)
#
# @deprecated Use {Api::V3::Readonly::Dashboards::Exporter} or
# {Api::V3::Readonly::Dashboards::Importer} instead.
# TODO: remove once dashboards_companies_mv retired
module Api
  module V3
    module Readonly
      module Dashboards
        class Company < Api::Readonly::BaseModel
          include Api::V3::Readonly::MaterialisedTable

          self.table_name = 'dashboards_companies'
          belongs_to :node

          INDEXES = [
            {columns: :commodity_id},
            {columns: :country_id},
            {columns: :name_tsvector, using: :gin},
            {columns: :node_type_id}
          ].freeze

          def self.key_translations
            {
              node_id: -> (key_value) {
                {id: key_value}
              },
              geometry_context_node_type_id: -> (key_value) {
                {}
              }
            }
          end
        end
      end
    end
  end
end
