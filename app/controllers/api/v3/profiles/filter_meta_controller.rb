module Api
  module V3
    module Profiles
      class FilterMetaController < ApiController
        include Api::V3::FilterParams
        skip_before_action :load_context

        def index
          render json: FilterMeta.new(
            filter_params.slice(:countries_ids, :commodities_ids)
          ).call
        end
      end
    end
  end
end
