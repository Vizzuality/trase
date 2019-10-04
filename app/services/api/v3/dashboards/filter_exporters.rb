module Api
  module V3
    module Dashboards
      class FilterExporters < BaseFilter
        include Query
        include CallWithQueryTerm

        def initialize(params)
          @self_ids = params.delete(:exporters_ids)
          @nodes_to_filter_by = Api::V3::Dashboards::NodesToFilterBy.new(params)
          super(params)
        end

        def call_with_query_term(query_term)
          super(query_term, {include_country_id: true})
        end

        private

        def filtered_class
          Api::V3::Readonly::Dashboards::Exporter
        end
      end
    end
  end
end
