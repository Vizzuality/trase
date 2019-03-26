module Api
  module V3
    module Dashboards
      module Charts
        class MultiYearNoNcontNodeTypeViewController < ApiController
          include FilterParams
          skip_before_action :load_context

          DEFAULT_TOP_N = 20

          def index
            ensure_required_param_present(:country_id)
            ensure_required_param_present(:commodity_id)
            ensure_required_param_present(:start_year)
            ensure_required_param_present(:end_year)
            ensure_required_param_present(:cont_attribute_id)
            ensure_required_param_present(:node_type_id)
            ensure_required_param_set(:top_n, DEFAULT_TOP_N)

            render json: MultiYearNoNcontNodeTypeView.new(
              ChartParameters.new(chart_params)
            ).call
          end
        end
      end
    end
  end
end
