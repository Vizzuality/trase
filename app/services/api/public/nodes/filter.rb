module Api
  module Public
    module Nodes
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
          @node_type = params[:node_type]
          @geo_id = params[:geo_id]
          @name = params[:name]
        end

        def initialize_query
          @query = Api::V3::Readonly::NodeWithFlows.
            without_unknowns.
            without_domestic.
            all
        end

        def apply_filters
          @query = @query.
            joins(:readonly_context).
            select(
              :id,
              :name,
              :node_type,
              :geo_id,
              "JSON_AGG(" \
                "DISTINCT JSONB_BUILD_OBJECT(" \
                  "'country', contexts_v.iso2, " \
                  "'commodity', contexts_v.commodity_name, " \
                  "'years', nodes_with_flows.years" \
                ")" \
              ") AS availability"
            ).
            group(:id, :name, :node_type, :geo_id)
          apply_country_filter
          apply_commodity_filter
          apply_node_type_filter
          apply_geo_id_filter
          apply_name_filter
        end

        def apply_country_filter
          return unless @country

          @query = @query.where("contexts_v.iso2" => @country)
        end

        def apply_commodity_filter
          return unless @commodity

          @query = @query.where("contexts_v.commodity_name" => @commodity)
        end

        def apply_node_type_filter
          return unless @node_type

          @query = @query.where(node_type: @node_type)
        end

        def apply_geo_id_filter
          return unless @geo_id

          @query = @query.where(geo_id: @geo_id)
        end

        def apply_name_filter
          return unless @name

          @query = @query.
            search_by_name(@name).
            group(:rank)
        end
      end
    end
  end
end
