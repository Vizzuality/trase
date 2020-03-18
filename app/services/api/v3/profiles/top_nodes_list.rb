module Api
  module V3
    module Profiles
      class TopNodesList < TopNodesForContextsList
        # @param context [Api::V3::Context]
        # @param node_type [Api::V3::NodeType] node type to return
        # @param node [Api::V3::Node] node to filter by
        # @param options [Hash]
        # @option options [Integer] year_start
        # @option options [Integer] year_end
        def initialize(context, node_type, node, options)
          super([context], node_type, options)
          @node = node

          @self_node_index = Api::V3::NodeType.node_index_for_id(
            context, @node.node_type_id
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
