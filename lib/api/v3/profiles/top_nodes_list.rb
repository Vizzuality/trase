module Api
  module V3
    module Profiles
      class TopNodesList < TopNodesForContextList
        def initialize(context, node, data)
          super(context, data)
          @node = node
          @self_node_index = Api::V3::NodeType.node_index_for_id(
            @context, @node.node_type_id
          )
        end

        private

        # attribute is either a Quant or an Ind
        def query_all_years(attribute, options)
          super(attribute, options).
            where('? = path[?]', @node.id, @self_node_index)
        end
      end
    end
  end
end
