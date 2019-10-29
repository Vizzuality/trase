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
                  'context_node_type_properties.role = ? AND ' \
                  'node_types.name != ?',
                  ContextNodeTypeProperty::SOURCE_ROLE,
                  NodeTypeName::COUNTRY_OF_PRODUCTION
                ).all
              },
              {
                section: 'COMPANIES',
                tabs: @query.where(
                  'context_node_type_properties.role' => [
                    ContextNodeTypeProperty::EXPORTER_ROLE,
                    ContextNodeTypeProperty::IMPORTER_ROLE
                  ]
                ).all
              },
              {
                section: 'EXPORTERS',
                tabs: @query.where(
                  'context_node_type_properties.role' => [
                    ContextNodeTypeProperty::EXPORTER_ROLE
                  ]
                ).all
              },
              {
                section: 'IMPORTERS',
                tabs: @query.where(
                  'context_node_type_properties.role' => [
                    ContextNodeTypeProperty::IMPORTER_ROLE
                  ]
                ).all
              },
              {
                section: 'DESTINATIONS',
                tabs: @query.where(
                  'context_node_type_properties.role' =>
                    ContextNodeTypeProperty::DESTINATION_ROLE
                ).all
              }
            ].map do |section|
              section[:tabs] = section[:tabs].map do |tab|
                {
                  id: tab.node_type_id,
                  name: tab.node_type_name,
                  profileType: tab.profile_type,
                  prefix: tab.property_prefix
                }
              end
              section
            end
          }
        end

        private

        def initialize_query
          @query = Api::V3::ContextNodeType.
            joins(:context, :node_type, :context_node_type_property).
            left_joins(:profile).
            select(
              'node_types.name AS node_type_name',
              'node_types.id AS node_type_id',
              'profiles.name AS profile_type',
              'context_node_type_properties.prefix AS property_prefix'
            ).group(
              'node_types.name',
              'node_types.id',
              'profiles.name',
              'context_node_type_properties.prefix'
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
