module Api
  module V3
    module Dashboards
      module Charts
        class SingleYearNcontOverviewController < ApiController
          include FilterParams
          skip_before_action :load_context

          def index
            ensure_required_param_present(:country_id)
            ensure_required_param_present(:commodity_id)
            ensure_required_param_present(:start_year)
            ensure_required_param_present(:cont_attribute_id)
            ensure_required_param_present(:ncont_attribute_id)

            render json: SingleYearNcontOverview.new(
              ChartParameters.new(chart_params)
            ).call
          end
        end
      end
    end
  end
end
