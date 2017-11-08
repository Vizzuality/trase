module Api
  module V3
    module GetContexts
      class ContextSerializer < ActiveModel::Serializer
        attributes :id, :is_default, :is_disabled, :years, :default_year, :country_id, :commodity_id, :default_basemap, :default_context_layers

        has_many :m_recolor_by_attributes, serializer: RecolorByAttributeSerializer, key: :recolor_by
        has_many :m_resize_by_attributes, serializer: ResizeByAttributeSerializer, key: :resize_by

        attribute :country_name do
          object.country.name
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

        attribute :default_context_layers do
          identifiers = object.contextual_layers.where(is_default: true).pluck(:identifier)
          identifiers.any? ? identifiers : nil
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
      end
    end
  end
end
