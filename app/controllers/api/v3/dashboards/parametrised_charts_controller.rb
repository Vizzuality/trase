module Api
  module V3
    module Dashboards
      class ParametrisedChartsController < ApiController
        include ChartParams
        skip_before_action :load_context

        def index
          ensure_required_param_present(:country_id)
          ensure_required_param_present(:commodity_id)
          ensure_required_param_present(:cont_attribute_id)

          parametrised_charts = ParametrisedCharts::List.new(
            ChartParameters::FlowValues.new(flow_values_chart_params)
          )
          parametrised_charts.call

          render json: parametrised_charts.data,
                 root: "data",
                 meta: parametrised_charts.meta,
                 each_serializer: Api::V3::Dashboards::ParametrisedChartSerializer,
                 url: proc { |options|
                   send(
                     :"api_v3_dashboards_charts_#{options.delete(:source)}_index_url",
                     options
                   )
                 }
        end
      end
    end
  end
end
