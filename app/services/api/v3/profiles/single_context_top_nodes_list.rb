module Api
  module V3
    module Profiles
      class SingleContextTopNodesList < CrossContextTopNodesList
        # @param context [Api::V3::Context]
        # @param node_type [Api::V3::NodeType] node type to return
        # @param node [Api::V3::Node] node to filter by
        # @param options [Hash]
        # @option options [Integer] year_start
        # @option options [Integer] year_end
        def initialize(context, node_type, node, options)
          super([context], node_type, node, options)
          @node = node

          context_node_type = Api::V3::ContextNodeType.find_by(
            node_type_id: @node.node_type_id, context_id: context.id
          )
          @node_index = context_node_type.column_position + 1
        end

        private

        # attribute is either a Quant or an Ind
        def query_all_years(attribute, options)
          query = super(attribute, options)

          query.where("? = path[?]", @node.id, @node_index)
        end
      end
    end
  end
end
