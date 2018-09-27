module Api
  module V3
    module Dashboards
      class FilterCommodities < BaseFilter
        include CallWithQueryTerm

        private

        def initialize_query
          @query = Api::V3::Readonly::Dashboards::Commodity.
            select(:id, :name).
            group(:id, :name)
        end
      end
    end
  end
end
