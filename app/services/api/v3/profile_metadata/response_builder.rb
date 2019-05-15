module Api
  module V3
    module ProfileMetadata
      class ResponseBuilder
        def initialize(context, node)
          @context = context
          @node = node
        end

        def call
          context_node_type = Api::V3::ContextNodeType.
            find_by(
              node_type_id: @node.node_type_id,
              context_id: @context.id
            )

          Api::V3::Profile.
            where(context_node_type_id: context_node_type.id).
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
