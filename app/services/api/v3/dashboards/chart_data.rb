module Api
  module V3
    module Dashboards
      class ChartData
        # @param params [Hash]
        # @option params [Array<Integer>] countries_ids
        # @option params [Array<Integer>] commodities_ids
        # @option params [Array<Integer>] sources_ids
        # @option params [Array<Integer>] companies_ids
        # @option params [Array<Integer>] destinations_ids
        def initialize(params)
          @countries_ids = params[:countries_ids] || []
          @commodities_ids = params[:commodities_ids] || []
          @nodes_ids = (params[:sources_ids] || []) +
            (params[:companies_ids] || []) +
            (params[:destinations_ids] || [])
          attribute_id = params[:attribute_id]
          raise 'Attribute missing' unless attribute_id

          @attribute = Api::V3::Readonly::Attribute.find(attribute_id)
          initialize_chart_data
        end

        def call
          @data, @meta = @chart_data.call
          {
            data: @data,
            meta: @meta
          }
        end

        private

        # This decides whether to pull values from flow_inds/quals/quants or
        # node_inds/quals/quants
        # Sometimes data for an attribute is only available in one of those,
        # sometimes in both
        # Prioritise data from flows
        def initialize_chart_data
          @chart_data =
            if @attribute.flows_values?
              ChartDataFromFlowAttributes.new(
                @attribute, @countries_ids, @commodities_ids, @nodes_ids
              )
            else
              ChartDataFromNodeAttributes.new(
                @attribute, @countries_ids, @commodities_ids, @nodes_ids
              )
            end
        end
      end
    end
  end
end
