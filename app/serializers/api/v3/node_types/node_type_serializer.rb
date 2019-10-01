module Api
  module V3
    module NodeTypes
      class NodeTypeSerializer < ActiveModel::Serializer
        attributes :id,
                   :name,
                   :position,
                   :group,
                   :role,
                   :is_default,
                   :is_geo,
                   :is_choropleth_disabled,
                   :profile_type,
                   :filter_to

        # this is a hardcoded way to know that Brazil subnational contexts
        # allow to expand biome into municipalities
        def filter_to
          return nil unless object['name'] == NodeTypeName::BIOME

          municipality = Api::V3::ContextNodeType.
            joins(:context).
            includes(:node_type).
            where(
              context_id: object['context_id'],
              'node_types.name' => NodeTypeName::MUNICIPALITY
            ).
            first&.
            node_type
          return nil unless municipality

          municipality.id
        end
      end
    end
  end
end
