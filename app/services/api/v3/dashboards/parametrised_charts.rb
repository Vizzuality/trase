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

        # @param chart_parameters [Api::V3::Dashboards::ChartParameters]
        def initialize(chart_parameters)
          @chart_params = chart_parameters.as_json.symbolize_keys
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
          @node_types_to_break_by =
            Api::V3::Dashboards::NodeTypesToBreakBy.new(@context).call

          if single_year? && !ncont_attribute?
            single_year_no_ncont_charts
          elsif single_year? && ncont_attribute?
            single_year_ncont_charts
          elsif !single_year? && !ncont_attribute?
            multi_year_no_ncont_charts
          else
            multi_year_ncont_charts
          end
        end

        private

        def single_year?
          @start_year.present? && @end_year.nil? ||
            @start_year.present? && @end_year.present? && @start_year == @end_year
        end

        def ncont_attribute?
          @ncont_attribute.present?
        end

        def single_year_no_ncont_charts
          parametrised_charts = [single_year_no_ncont_overview] +
            @node_types_to_break_by.map do |node_type|
              single_year_no_ncont_node_type_view(node_type)
            end
          parametrised_charts.map { |chart| all_params.merge(chart) }
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
            type: SingleYearCharts::ChartType.call(
              data: SingleYearCharts::PrepareData.call(
                context: @context,
                top_n: 10,
                cont_attribute: @cont_attribute,
                ncont_attribute: nil,
                year: @start_year,
                node_type_idx: Api::V3::NodeType.node_index_for_id(@context, node_type.id),
                type: :no_ncont
              ),
              default_chart_type: HORIZONTAL_BAR_CHART
            ),
            x: :node_type,
            node_type_id: node_type.id
          }
        end

        def single_year_ncont_charts
          parametrised_charts = [single_year_ncont_overview] +
            @node_types_to_break_by.map do |node_type|
              single_year_ncont_node_type_view(node_type)
            end
          parametrised_charts.map { |chart| all_params.merge(chart) }
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
            type: SingleYearCharts::ChartType.call(
              data: SingleYearCharts::PrepareData.call(
                context: @context,
                top_n: 10,
                cont_attribute: @cont_attribute,
                ncont_attribute: @ncont_attribute,
                year: @start_year,
                node_type_idx: Api::V3::NodeType.node_index_for_id(@context, node_type.id),
                type: :ncont
              ),
              default_chart_type: HORIZONTAL_STACKED_BAR_CHART
            ),
            x: :node_type,
            break_by: :ncont_attribute,
            node_type_id: node_type.id
          }
        end

        def multi_year_no_ncont_charts
          parametrised_charts = [multi_year_no_ncont_overview] +
            @node_types_to_break_by.map do |node_type|
              multi_year_no_ncont_node_type_view(node_type)
            end
          parametrised_charts.map { |chart| all_params.merge(chart) }
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

        # this is different from the others: both overview and node type view
        # are presented using the same chart type
        # however, node type view has one chart per selected node
        def multi_year_ncont_charts
          parametrised_charts = [all_params.merge(multi_year_ncont_overview)]
          [
            :sources_ids, :companies_ids, :destinations_ids
          ].each do |nodes_ids_param_name|
            parametrised_charts += charts_per_selected_node(
              nodes_ids_param_name
            )
          end
          parametrised_charts
        end

        def charts_per_selected_node(nodes_ids_param_name)
          nodes_ids = instance_variable_get("@#{nodes_ids_param_name}")
          return [] unless nodes_ids.any?

          nodes = Api::V3::Node.where(id: nodes_ids).includes(:node_type)
          return [] unless nodes.any?

          nodes.map do |node|
            node_type = node.node_type
            node_type_is_active = @node_types_to_break_by.find do |nt|
              nt.id == node_type.id
            end
            next unless node_type_is_active

            all_params.
              except(nodes_ids_param_name).
              merge(nodes_ids_param_name => [node.id].join(',')).
              merge(
                multi_year_ncont_node_type_view(node_type)
              )
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
            source: :multi_year_ncont_overview,
            type: STACKED_BAR_CHART,
            x: :year,
            break_by: :ncont_attribute,
            node_type_id: node_type.id
          }
        end

        def all_params
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
