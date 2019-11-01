module Api
  module Public
    module NodeTypes
      class Filter
        attr_reader :data

        def initialize(params = {})
          initialize_params(params)
        end

        def call
          initialize_query
          apply_filters
          @query
        end

        private

        def initialize_params(params)
          @country = params[:country]
          @commodity = params[:commodity]
        end

        def initialize_query
# SELECT
#   countries.iso2 AS country,
#   commodities.name AS commodity,
#   JSONB_AGG(JSONB_BUILD_OBJECT(
#       'name', node_types.name,
#       'role', cnt_props.role
#   ) ORDER BY cnt.column_position)
# FROM context_node_types cnt
# JOIN node_types ON cnt.node_type_id = node_types.id
# JOIN context_node_type_properties cnt_props ON cnt.id = cnt_props.context_node_type_id
# JOIN contexts ON cnt.context_id = contexts.id
# JOIN countries ON contexts.country_id = countries.id
# JOIN commodities ON contexts.commodity_id = commodities.id
# GROUP BY countries.iso2, commodities.name
          @query = Api::V3::ContextNodeType.
            joins(
              :node_type,
              :context_node_type_property
            ).
            joins('JOIN contexts_mv ON context_id = contexts_mv.id').
            select([
              'contexts_mv.iso2 AS country',
              'contexts_mv.commodity_name AS commodity',
              "JSONB_AGG(
                JSONB_BUILD_OBJECT(
                  'name', node_types.name,
                  'role', context_node_type_properties.role
                )
                ORDER BY column_position
              ) AS node_types"
            ]).
            group('contexts_mv.iso2, contexts_mv.commodity_name')
        end

        def apply_filters
          apply_country_filter
          apply_commodity_filter
        end

        def apply_country_filter
          return unless @country

          @query = @query.where('contexts_mv.iso2' => @country)
        end

        def apply_commodity_filter
          return unless @commodity

          @query = @query.where('contexts_mv.commodity_name' => @commodity)
        end
      end
    end
  end
end
