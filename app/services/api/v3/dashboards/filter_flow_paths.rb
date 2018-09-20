module Api
  module V3
    module Dashboards
      class FilterFlowPaths
        # @param params [Hash]
        # @option params [Array<Integer>] countries_ids
        # @option params [Array<Integer>] commodities_ids
        # @option params [Array<Integer>] sources_ids
        # @option params [Array<Integer>] companies_ids
        # @option params [Array<Integer>] destinations_ids
        def initialize(params)
          @countries_ids = params[:countries_ids] || []
          @commodities_ids = params[:commodities_ids] || []
          @node_ids = (params[:sources_ids] || []) +
            (params[:companies_ids] || []) +
            (params[:destinations_ids] || [])
          @filtered = false
          initialize_query
        end

        def initialize_query
          @query = Api::V3::Readonly::Dashboards::FlowPath.all
          filter_by_countries
          filter_by_commodities
          filter_by_nodes
        end

        def call
          @query
        end

        def filtered?
          @filtered
        end

        private

        def filter_by_countries
          return unless @countries_ids.any?

          @query = @query.where(country_id: @countries_ids)
          @filtered = true
        end

        def filter_by_commodities
          return unless @commodities_ids.any?

          @query = @query.where(commodity_id: @commodities_ids)
          @filtered = true
        end

        def filter_by_nodes
          return unless @node_ids.any?

          @query = @query.where(node_id: @node_ids)
          @filtered = true
        end
      end
    end
  end
end
