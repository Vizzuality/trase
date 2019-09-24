module Api
  module V3
    module ProfileMetadata
      class ResponseBuilder
        def initialize(context, node)
          @context = context
          @node = node
        end

        def call
          Api::V3::Profile.
            includes(context_node_type: :context_node_type_property).
            references(:context_node_type).
            where(
              'context_node_types.node_type_id' => @node.node_type_id,
              'context_node_types.context_id' => @context.id
            ).
            includes(charts: :children).
            references(:charts).
            where('charts.parent_id IS NULL').
            limit(1).
            first
        end
      end
    end
  end
end
