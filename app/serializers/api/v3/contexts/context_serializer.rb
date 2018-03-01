module Api
  module V3
    module Contexts
      class ContextSerializer < ActiveModel::Serializer
        attributes :id, :is_default, :is_disabled, :years, :default_year,
                   :country_id, :commodity_id, :default_basemap, :is_subnational

        has_many :readonly_recolor_by_attributes,
                 serializer: RecolorByAttributeSerializer, key: :recolor_by
        has_many :readonly_resize_by_attributes,
                 serializer: ResizeByAttributeSerializer, key: :resize_by

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

        attribute :filter_by do
          [NodeTypeName::BIOME, NodeTypeName::STATE].map do |node_type_name|
            node_type_filter node_type_name
          end.compact
        end

        attribute :world_map do
          {
            map_column_id: object.country_context_node_type&.node_type_id,
            list_column_id: object.exporter_context_node_type&.node_type_id
          }
        end

        def node_type_filter(node_type_name)
          context_node_type = object.context_node_types.find do |cnt|
            cnt.node_type.name == node_type_name
          end
          return nil unless context_node_type

          {
            name: node_type_name,
            nodes: nodes_list(context_node_type.node_type_id)
          }
        end

        def nodes_list(node_type_id)
          nodes = Api::V3::Node.
            select(:id, :name).
            where(
              node_type_id: node_type_id,
              is_unknown: false
            ).
            where("nodes.name NOT LIKE 'OTHER%'")
          nodes.map do |node|
            {
              name: node.name,
              node_id: node.id
            }
          end
        end
      end
    end
  end
end
