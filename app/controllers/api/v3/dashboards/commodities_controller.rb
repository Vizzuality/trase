module Api
  module V3
    module Dashboards
      class CommoditiesController < ApiController
        include FilterParams
        skip_before_action :load_context

        def index
          @commodities = FilterCommodities.new(filter_params).call
          render json: @commodities,
                 root: 'data',
                 each_serializer: Api::V3::Dashboards::CommoditySerializer
        end
      end
    end
  end
end
