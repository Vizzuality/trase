module Api
  module V3
    module Dashboards
      class ParametrisedChartsController < ApiController
        include FilterParams
        skip_before_action :load_context

        def index
          ensure_required_param_present(:country_id)
          ensure_required_param_present(:commodity_id)
          ensure_required_param_present(:cont_attribute_id)

          render json: ParametrisedCharts.new(ChartParameters.new(chart_params)).call,
                 root: 'data',
                 each_serializer: Api::V3::Dashboards::ParametrisedChartSerializer,
                 url: proc { |options|
                   send(:"api_v3_dashboards_charts_#{options.delete(:source)}_index_url", options)
                 }
        end
      end
    end
  end
end
