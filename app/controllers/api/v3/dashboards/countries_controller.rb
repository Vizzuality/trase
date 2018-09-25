module Api
  module V3
    module Dashboards
      class CountriesController < ApiController
        include FilterParams
        skip_before_action :load_context

        def index
          @countries = FilterCountries.new(filter_params).call
          render json: @countries,
                 root: 'data',
                 meta: FilterSourcesMeta.new(filter_params.slice(:countries_ids, :commodities_ids)).call,
                 each_serializer: Api::V3::Dashboards::CountrySerializer
        end
      end
    end
  end
end
