module Api
  module V3
    module Dashboards
      class FilterCountries < BaseFilter
        include CallWithQueryTerm

        private

        def initialize_query
          @query = Api::V3::Readonly::Dashboards::Country.
            select(:id, :name).
            group(:id, :name)
        end
      end
    end
  end
end
