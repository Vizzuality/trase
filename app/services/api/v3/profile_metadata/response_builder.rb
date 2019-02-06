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
            joins(context_node_type: [node_type: :nodes]).
            where('nodes.id' => @node.id).
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
