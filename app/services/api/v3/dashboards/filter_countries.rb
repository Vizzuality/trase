module Api
  module V3
    module Dashboards
      class FilterCountries < BaseFilter
        include CallWithQueryTerm

        def initialize(params)
          @self_ids = params.delete(:countries_ids)
          super(params)
        end

        private

        def initialize_query
          @query = Api::V3::Readonly::Dashboards::Country.
            select(:id, :name, :iso2).
            group(:id, :name, :iso2).
            order(:name)
        end
      end
    end
  end
end
