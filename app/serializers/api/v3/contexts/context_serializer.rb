module Api
  module V3
    module Contexts
      class ContextSerializer < ActiveModel::Serializer
        attributes :id,
          :is_default,
          :is_disabled,
          :years,
          :subnational_years,
          :default_year,
          :country_id,
          :country_name,
          :commodity_id,
          :commodity_name,
          :default_basemap,
          :is_subnational,
          :is_highlighted,
          :has_profiles

        has_many :readonly_recolor_by_attributes,
          serializer: RecolorByAttributeSerializer, key: :recolor_by
        has_many :readonly_resize_by_attributes,
          serializer: ResizeByAttributeSerializer, key: :resize_by
        has_many :methods_and_data_docs

        attribute :map do
          {
            latitude: object.country.latitude,
            longitude: object.country.longitude,
            zoom: object.country.zoom
          }
        end

        attribute :filter_by do
          nodes = object.biome_nodes
          next [] if nodes.length.zero?

          [
            {
              name: NodeTypeName::BIOME,
              nodes: nodes.map do |node|
                {
                  name: node.name,
                  node_id: node.id,
                  geo_id: node.geo_id
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
            country_column_id: object["node_types_by_name"][NodeTypeName::COUNTRY_OF_DESTINATION] ||
              object["node_types_by_name"][NodeTypeName::COUNTRY_OF_IMPORT] ||
              object["node_types_by_name"][NodeTypeName::COUNTRY_OF_FIRST_IMPORT] ||
              object["node_types_by_name"][NodeTypeName::COUNTRY],
            exporter_column_id: object["node_types_by_name"][NodeTypeName::EXPORTER]
          }
        end

        attribute :default_columns do
          object["node_types"].map do |node_type_props|
            next unless node_type_props["is_default"]

            {
              id: node_type_props["node_type_id"],
              group: node_type_props["column_group"]
            }
          end.compact
        end
      end
    end
  end
end
