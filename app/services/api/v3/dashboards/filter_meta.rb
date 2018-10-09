module Api
  module V3
    module Dashboards
      class FilterMeta
        # @param params [Hash]
        # @option params [Array<Integer>] countries_ids
        # @option params [Array<Integer>] commodities_ids
        def initialize(params)
          @countries_ids = params[:countries_ids] || []
          @commodities_ids = params[:commodities_ids] || []
          initialize_query
        end

        def call
          {
            data: [
              {
                section: 'SOURCES',
                tabs: @query.where(
                  'context_node_type_properties.column_group' => 0
                ).all
              },
              {
                section: 'COMPANIES',
                tabs: @query.where(
                  'node_types.name' => [
                    NodeTypeName::IMPORTER,
                    NodeTypeName::EXPORTER,
                    NodeTypeName::TRADER
                  ]
                ).all
              },
              {
                section: 'DESTINATIONS',
                tabs: @query.where(
                  'context_node_type_properties.column_group' => 3
                ).all
              }
            ].map do |section|
              section[:tabs] = section[:tabs].map do |tab|
                {id: tab.node_type_id, name: tab.node_type_name}
              end
              section
            end
          }
        end

        private

        def initialize_query
          @query = Api::V3::ContextNodeType.
            joins(:context, :node_type, :context_node_type_property).
            select(
              'node_types.name AS node_type_name',
              'node_types.id AS node_type_id'
            ).group(
              'node_types.name',
              'node_types.id'
            )

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
