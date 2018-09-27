module Api
  module V3
    module Dashboards
      class CountriesController < ApiController
        include FilterParams
        include Collection
        skip_before_action :load_context

        def index
          initialize_collection_for_index

          render json: @collection,
                 root: 'data',
                 meta: FilterSourcesMeta.new(filter_params.slice(:countries_ids, :commodities_ids)).call,
                 each_serializer: Api::V3::Dashboards::CountrySerializer
        end

        private

        def filter_klass
          FilterCountries
        end
      end
    end
  end
end
