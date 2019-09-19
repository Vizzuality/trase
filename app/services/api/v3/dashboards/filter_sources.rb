module Api
  module V3
    module Dashboards
      class FilterSources < BaseFilter
        include CallWithQueryTerm

        def initialize(params)
          @self_ids = params.delete(:sources_ids)
          super(params)
        end

        def call_with_query_term(query_term)
          super(query_term, {include_country_id: true})
        end

        private

        def initialize_query
          @query = Api::V3::Readonly::Dashboards::Source.
            select(
              :id,
              :name,
              :node_type,
              :node_type_id
            ).
            group(
              :id,
              :name,
              :node_type,
              :node_type_id
            ).
            order(:name)
        end
      end
    end
  end
end
