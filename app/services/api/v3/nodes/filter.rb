module Api
  module V3
    module Nodes
      class Filter
        # @param context [Api::V3::Context]
        # @param params [Hash]
        # @option params [Array<Integer>] node_types_ids
        # @option params [Array<Integer>] nodes_ids
        def initialize(context, params)
          @context = context
          @node_types_ids = params[:node_types_ids] || []
          @nodes_ids = params[:nodes_ids] || []
          initialize_query
          apply_node_type_filter
          apply_node_filter
        end

        def call
          @query.all
        end

        private

        def initialize_query
          @query = Api::V3::Readonly::NodeWithFlowsOrGeo.
            select([
              :id,
              :main_id,
              :name,
              :geo_id,
              :is_domestic_consumption,
              :is_unknown,
              :node_type_id,
              :node_type,
              :profile,
              :has_flows,
              :is_aggregated
            ]).
            where(context_id: @context.id)
        end

        def apply_node_type_filter
          return unless @node_types_ids.any?

          @query = @query.where(node_type_id: @node_types_ids)
        end

        def apply_node_filter
          return unless @nodes_ids.any?

          @query = @query.where(id: @nodes_ids)
        end
      end
    end
  end
end
