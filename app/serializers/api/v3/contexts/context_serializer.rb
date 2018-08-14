module Api
  module V3
    module Contexts
      class ContextSerializer < ActiveModel::Serializer
        attributes :id, :is_default, :is_disabled, :years, :default_year,
                   :country_id, :commodity_id, :default_basemap, :is_subnational, :is_highlighted

        has_many :readonly_recolor_by_attributes,
                 serializer: RecolorByAttributeSerializer, key: :recolor_by
        has_many :readonly_resize_by_attributes,
                 serializer: ResizeByAttributeSerializer, key: :resize_by

        attribute :country_name do
          object.country.name
        end

        attribute :has_profiles do
          object.profiles.any?
        end

        attribute :map do
          {
            latitude: object.country.latitude,
            longitude: object.country.longitude,
            zoom: object.country.zoom
          }
        end

        attribute :commodity_name do
          object.commodity.name
        end

        # TODO: remove once API migration finalised
        attribute :filter_by do
          biome_context_node_type = object.context_node_types.
            joins(:node_type).
            where('node_types.name' => NodeTypeName::BIOME).
            first
          if biome_context_node_type # Brazil - Soy only
            [
              {
                name: NodeTypeName::BIOME,
                nodes: Api::V3::Node.where(
                  node_type_id: biome_context_node_type.node_type_id
                ).
                  where(is_unknown: false).
                  where("name NOT LIKE 'OTHER%'").map do |node|
                    {
                      name: node.name,
                      node_id: node.id
                    }
                  end
              }
            ]
          else
            []
          end
        end

        attribute :world_map do
          {
            map_column_id: object.country_context_node_type&.node_type_id,
            list_column_id: object.exporter_context_node_type&.node_type_id
          }
        end
      end
    end
  end
end
