module Api
  module V3
    module Profiles
      class CrossContextTopNodesList < TopNodesForContextsList
        # @param contexts [Array<Api::V3::Context>]
        # @param node_type [Api::V3::NodeType] node type to return
        # @param node [Api::V3::Node] node to filter by
        # @param options [Hash]
        # @option options [Integer] year_start
        # @option options [Integer] year_end
        def initialize(contexts, node_type, node, options)
          super(contexts, node_type, options)
          @node = node

          context_node_types = Api::V3::ContextNodeType.where(
            node_type_id: @node.node_type_id, context_id: contexts.map(&:id)
          )
          @node_indices_by_context = context_node_types.map do |cnt|
            [cnt.context_id, cnt.column_position + 1]
          end
        end

        private

        # TODO: is this used?
        # def top_nodes_list
        #   return @top_nodes_list if defined? @top_nodes_list

        #   @top_nodes_list = Api::V3::Profiles::SingleContextTopNodesList.new(
        #     @context,
        #     @top_node_type,
        #     @node,
        #     year_start: @year,
        #     year_end: @year
        #   )
        # end

        # attribute is either a Quant or an Ind
        def query_all_years(attribute, options)
          query = super(attribute, options)
          query = query.unscope(where: :context_id)
          where_conds = []
          where_vars = []
          @node_indices_by_context.each do |context_id, node_idx|
            where_conds << "flows.context_id = ? AND ? = path[?]"
            where_vars += [context_id, @node.id, node_idx]
          end
          query.where(
            where_conds.join(" OR "), *where_vars
          )
        end
      end
    end
  end
end
