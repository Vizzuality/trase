module Api
  module V3
    module Dashboards
      class FilterCompanies < BaseFilter
        include CallWithQueryTerm

        def initialize(params)
          @self_ids = params.delete(:companies_ids)
          super(params)
        end

        private

        def initialize_query
          @query = Api::V3::Readonly::Dashboards::Company.
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
            )
        end
      end
    end
  end
end
