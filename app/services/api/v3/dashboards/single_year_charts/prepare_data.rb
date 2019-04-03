module Api
  module V3
    module Dashboards
      module SingleYearCharts
        class PrepareData
          include ActiveSupport::Configurable

          attr_reader :context, :top_n, :cont_attribute, :ncont_attribute, :year, :node_type_idx, :type

          config_accessor :with_ncont do
            Api::V3::Dashboards::SingleYearCharts::NcontNodeType
          end

          config_accessor :no_ncont do
            Api::V3::Dashboards::SingleYearCharts::NoNcontNodeType
          end

          DATA_MAP = {
            ncont: with_ncont,
            no_ncont: no_ncont
          }

          class << self
            def call(context:, top_n:, cont_attribute:, ncont_attribute:, year:, node_type_idx:, type:)
              new(
                context: context,
                top_n: top_n,
                cont_attribute: cont_attribute,
                ncont_attribute: ncont_attribute,
                year: year,
                node_type_idx: node_type_idx,
                type: type
              ).call
            end
          end

          def initialize(context:, top_n:, cont_attribute:, ncont_attribute:, year:, node_type_idx:, type:)
            @context = context
            @top_n = top_n
            @cont_attribute = cont_attribute
            @ncont_attribute = ncont_attribute
            @year = year
            @node_type_idx = node_type_idx
            @type = type
          end

          def call
            DATA_MAP[type].call(
              context: context,
              top_n: top_n,
              cont_attribute: cont_attribute,
              ncont_attribute: ncont_attribute,
              year: year,
              node_type_idx: node_type_idx
            )
          end
        end
      end
    end
  end
end
