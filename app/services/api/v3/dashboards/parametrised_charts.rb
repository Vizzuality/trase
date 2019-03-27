module Api
  module V3
    module Dashboards
      class ParametrisedCharts
        DYNAMIC_SENTENCE = :dynamic_sentence
        DONUT_CHART = :donut_chart
        BAR_CHART = :bar_chart
        STACKED_BAR_CHART = :stacked_bar_chart
        HORIZONTAL_BAR_CHART = :horizontal_bar_chart
        HORIZONTAL_STACKED_BAR_CHART = :horizontal_stacked_bar_chart
        VALUE_TABLE = :value_table

        # @param chart_parameters [Api::V3::Dashboards::ChartParameters]
        def initialize(chart_parameters)
          @country_id = chart_parameters.country_id
          @commodity_id = chart_parameters.commodity_id
          @context = chart_parameters.context
          @cont_attribute = chart_parameters.cont_attribute
          @ncont_attribute = chart_parameters.ncont_attribute
          @sources_ids = chart_parameters.sources_ids
          @companies_ids = chart_parameters.companies_ids
          @destinations_ids = chart_parameters.destinations_ids

          @start_year = chart_parameters.start_year
          @end_year = chart_parameters.end_year
        end

        def call
          chart_types =
            if single_year? && !ncont_attribute?
              single_year_no_ncont_charts
            elsif single_year? && ncont_attribute?
              single_year_ncont_charts
            elsif !single_year? && !ncont_attribute?
              multi_year_no_ncont_charts
            else
              multi_year_ncont_charts
            end
          chart_types.map do |chart_params|
            sanitized_chart_params.merge(chart_params)
          end
        end

        private

        def node_types_to_break_by
          Api::V3::Dashboards::NodeTypesToBreakBy.new(@context).call
        end

        def single_year?
          @start_year.present? && @end_year.nil? ||
            @start_year.present? && @end_year.present? && @start_year == @end_year
        end

        def ncont_attribute?
          @ncont_attribute.present?
        end

        def single_year_no_ncont_charts
          [single_year_no_ncont_overview] +
            node_types_to_break_by.map do |node_type|
              single_year_no_ncont_node_type_view(node_type)
            end
        end

        def single_year_no_ncont_overview
          {
            source: :single_year_no_ncont_overview,
            type: DYNAMIC_SENTENCE,
            x: nil
          }
        end

        def single_year_no_ncont_node_type_view(node_type)
          {
            source: :single_year_no_ncont_node_type_view,
            type: HORIZONTAL_BAR_CHART,
            x: :node_type,
            node_type_id: node_type.id
          }
        end

        def single_year_ncont_charts
          [single_year_ncont_overview] +
            node_types_to_break_by.map do |node_type|
              single_year_ncont_node_type_view(node_type)
            end
        end

        def single_year_ncont_overview
          {
            source: :single_year_ncont_overview,
            type: DONUT_CHART,
            x: :ncont_attribute
          }
        end

        def single_year_ncont_node_type_view(node_type)
          {
            source: :single_year_ncont_node_type_view,
            type: HORIZONTAL_STACKED_BAR_CHART, # TODO: or VALUE_TABLE?
            x: :node_type,
            break_by: :ncont_attribute,
            node_type_id: node_type.id
          }
        end

        def multi_year_no_ncont_charts
          [multi_year_no_ncont_overview] +
            node_types_to_break_by.map do |node_type|
              multi_year_no_ncont_node_type_view(node_type)
            end
        end

        def multi_year_no_ncont_overview
          {
            source: :multi_year_no_ncont_overview,
            type: BAR_CHART,
            x: :year
          }
        end

        def multi_year_no_ncont_node_type_view(node_type)
          {
            source: :multi_year_no_ncont_node_type_view,
            type: STACKED_BAR_CHART,
            x: :year,
            break_by: :node_type,
            node_type_id: node_type.id
          }
        end

        def multi_year_ncont_charts
          [multi_year_ncont_overview] +
            node_types_to_break_by.map do |node_type|
              multi_year_ncont_node_type_view(node_type)
            end
        end

        def multi_year_ncont_overview
          {
            source: :multi_year_ncont_overview,
            type: STACKED_BAR_CHART,
            x: :year,
            break_by: :ncont_attribute
          }
        end

        def multi_year_ncont_node_type_view(node_type)
          {
            source: :multi_year_ncont_node_type_view,
            type: STACKED_BAR_CHART,
            x: :year,
            break_by: :ncont_attribute,
            filter_by: :node_type,
            node_type_id: node_type.id
          }
        end

        def sanitized_chart_params
          {
            cont_attribute_id: @cont_attribute.id,
            ncont_attribute_id: @ncont_attribute&.id,
            country_id: @country_id,
            commodity_id: @commodity_id,
            sources_ids: @sources_ids.join(','),
            companies_ids: @companies_ids.join(','),
            destinations_ids: @destinations_ids.join(','),
            start_year: @start_year,
            end_year: @end_year
          }
        end
      end
    end
  end
end
