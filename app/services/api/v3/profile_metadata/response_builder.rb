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
            limit(1).
            first()
        end
      end
    end
  end
end
