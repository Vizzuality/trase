module Api
  module V3
    module Dashboards
      class ChartDataController < ApiController
        include FilterParams
        skip_before_action :load_context

        def index
          # ensure attribute_id given
          ensure_required_param_present(:attribute_id)
          render json: ChartData.new(filter_params).call
        end

        private

        def filter_params
          super.merge(attribute_id: string_to_int(params[:attribute_id]))
        end
      end
    end
  end
end
