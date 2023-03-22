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
          @query = Api::V3::ContextNodeType.
            joins(
              :node_type,
              :context_node_type_property
            ).
            joins("JOIN contexts_v ON context_id = contexts_v.id").
            select([
              "contexts_v.iso2 AS country",
              "contexts_v.commodity_name AS commodity",
              "JSONB_AGG(
                JSONB_BUILD_OBJECT(
                  'name', node_types.name,
                  'role', context_node_type_properties.role
                )
                ORDER BY column_position
              ) AS node_types"
            ]).
            where("context_node_type_properties.is_visible").
            group("contexts_v.iso2, contexts_v.commodity_name")
        end

        def apply_filters
          apply_country_filter
          apply_commodity_filter
        end

        def apply_country_filter
          return unless @country

          @query = @query.where("contexts_v.iso2" => @country)
        end

        def apply_commodity_filter
          return unless @commodity

          @query = @query.where("contexts_v.commodity_name" => @commodity)
        end
      end
    end
  end
end
