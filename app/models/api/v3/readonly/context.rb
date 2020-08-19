# == Schema Information
#
# Table name: contexts_v
#
#  id                 :integer          primary key
#  country_id         :integer
#  commodity_id       :integer
#  years              :integer          is an Array
#  subnational_years  :integer          is an Array
#  default_year       :integer
#  commodity_name     :text
#  country_name       :text
#  iso2               :text
#  default_basemap    :text
#  is_disabled        :boolean
#  is_default         :boolean
#  is_subnational     :boolean
#  is_highlighted     :boolean
#  has_profiles       :boolean
#  node_types_by_role :jsonb
#  node_types_by_name :jsonb
#  node_types         :jsonb
#
module Api
  module V3
    module Readonly
      class Context < Api::Readonly::BaseModel
        self.table_name = 'contexts_v'

        belongs_to :country
        has_many :context_node_types
        has_many :node_types, through: :context_node_types
        has_many :flows
        has_many :readonly_recolor_by_attributes, class_name: 'Readonly::RecolorByAttribute'
        has_many :readonly_resize_by_attributes, class_name: 'Readonly::ResizeByAttribute'

        def biome_nodes
          return [] unless node_types_by_name[NodeTypeName::BIOME].present?

          # Brazil - soy & Paraguay - soy only
          Api::V3::Readonly::NodeWithFlows.
            without_unknowns.
            without_domestic.
            select([:id, :name, :geo_id]).
            where(context_id: id, node_type: NodeTypeName::BIOME).
            order(:name)
        end
      end
    end
  end
end
