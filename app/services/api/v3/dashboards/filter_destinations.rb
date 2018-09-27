module Api
  module V3
    module Dashboards
      class FilterDestinations < BaseFilter
        include CallWithQueryTerm

        def initialize(params)
          @self_ids = params.delete(:destinations_ids)
          super(params)
        end

        private

        def initialize_query
          @query = Api::V3::Readonly::Dashboards::Destination.
            select(
              :id,
              :name,
              :node_type
            ).
            group(
              :id,
              :name,
              :node_type
            )
        end
      end
    end
  end
end
