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

        attribute :filter_by do
          nodes = object.biome_nodes
          next [] unless nodes.any?

          [
            {
              name: NodeTypeName::BIOME,
              nodes: nodes.map do |node|
                {
                  name: node.name,
                  node_id: node.id
                }
              end
            }
          ]
        end

        attribute :world_map do
          {
            geo_id: object.country.iso2,
            annotation_position_x_pos: object.country.annotation_position_x_pos,
            annotation_position_y_pos: object.country.annotation_position_y_pos,
            country_column_id: object.country_context_node_type&.node_type_id,
            exporter_column_id: object.exporter_context_node_type&.node_type_id
          }
        end
      end
    end
  end
end
