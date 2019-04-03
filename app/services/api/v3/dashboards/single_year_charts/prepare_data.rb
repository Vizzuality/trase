module Api
  module V3
    module Dashboards
      module SingleYearCharts
        class PrepareData
          include ActiveSupport::Configurable

          attr_reader :type, :chart_params, :top_n, :node_type_idx

          config_accessor :with_ncont do
            Api::V3::Dashboards::SingleYearCharts::NcontNodeType
          end

          config_accessor :no_ncont do
            Api::V3::Dashboards::SingleYearCharts::NoNcontNodeType
          end

          DATA_MAP = {
            ncont: with_ncont,
            no_ncont: no_ncont
          }.freeze

          class << self
            def call(chart_params:, top_n:, node_type_idx:, type:)
              new(
                chart_params: chart_params,
                node_type_idx: node_type_idx,
                top_n: top_n,
                type: type
              ).call
            end
          end

          def initialize(chart_params:, top_n:, node_type_idx:, type:)
            @type = type
            @node_type_idx = node_type_idx
            @chart_params = chart_params
            @top_n = top_n
          end

          def call
            DATA_MAP[type].call(
              chart_params: chart_params,
              node_type_idx: node_type_idx,
              top_n: top_n
            )
          end
        end
      end
    end
  end
end
