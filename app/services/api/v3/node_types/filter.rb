module Api
  module V3
    module NodeTypes
      class Filter
        def initialize(context)
          @context = context
        end

        def call
          Api::V3::NodeType.
            joins(context_node_types: :context_node_type_property).
            joins("LEFT JOIN #{Api::V3::Profile.table_name} ON profiles.context_node_type_id = context_node_types.id").
            select([
              'node_types.id',
              'context_node_types.context_id',
              'context_node_types.column_position AS position',
              'context_node_type_properties.column_group AS group',
              'context_node_type_properties.role',
              'node_types.name AS name',
              'context_node_type_properties.is_default',
              'context_node_type_properties.is_geo_column AS is_geo',
              'context_node_type_properties.is_choropleth_disabled',
              'profiles.name AS profile_type'
            ]).
            where('context_node_types.context_id = :context_id', context_id: @context.id).
            order('context_node_types.column_position ASC')
        end
      end
    end
  end
end
