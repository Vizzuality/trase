module Api
  module V3
    module Dashboards
      class FilterSourcesMeta
        # @param params [Hash]
        # @option params [Array<Integer>] countries_ids
        # @option params [Array<Integer>] commodities_ids
        def initialize(params)
          @countries_ids = params[:countries_ids] || []
          @commodities_ids = params[:commodities_ids] || []
          initialize_query
        end

        def call
          @query.all
        end

        private

        def initialize_query
          @query = Api::V3::ContextNodeType.
            joins(:context, :node_type, :context_node_type_property).
            select(
              :id,
              :context_id,
              'contexts.country_id',
              'contexts.commodity_id',
              'node_types.name AS node_type_name',
              'node_types.id AS node_type_id',
              'column_position'
            ).
            where('context_node_type_properties.column_group' => 0)
          if @countries_ids.any?
            @query = @query.where('contexts.country_id' => @countries_ids)
          end
          if @commodities_ids.any?
            @query = @query.where('contexts.commodity_id' => @commodities_ids)
          end
          @query
        end
      end
    end
  end
end
