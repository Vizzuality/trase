module Api
  module V3
    module Dashboards
      module ParametrisedCharts
        class NodeValuesCharts
          DYNAMIC_SENTENCE = :dynamic_sentence
          BAR_CHART = :bar_chart

          # @param chart_parameters [Api::V3::Dashboards::ChartParameters::FlowValues]
          def initialize(chart_parameters)
            @chart_params = chart_parameters
            @context = chart_parameters.context
            @start_year = chart_parameters.start_year
            @end_year = chart_parameters.end_year
            initialize_nodes
          end

          def call
            if single_year?
              single_year_charts
            else
              multi_year_charts
            end
          end

          private

          def initialize_nodes
            @sources_ids = @chart_params.sources_ids
            # TODO: remove once dashboards_companies_mv retired
            @companies_ids = @chart_params.companies_ids
            @exporters_ids = @chart_params.exporters_ids
            @importers_ids = @chart_params.importers_ids
            @destinations_ids = @chart_params.destinations_ids
            nodes = Api::V3::Node.find(
              @sources_ids + @companies_ids + @destinations_ids
            )
            @sources = nodes.select do |node|
              @sources_ids.include? node.id
            end
            # TODO: remove once dashboards_companies_mv retired
            @companies = nodes.select do |node|
              @companies_ids.include? node.id
            end
            @exporters = nodes.select do |node|
              @exporters_ids.include? node.id
            end
            @importers = nodes.select do |node|
              @importers_ids.include? node.id
            end
            @destinations = nodes.select do |node|
              @destinations_ids.include? node.id
            end
          end

          def single_year?
            @start_year.present? && @end_year.nil? ||
              @start_year.present? && @end_year.present? && @start_year == @end_year
          end

          def single_year_charts
            parametrised_charts = attributes_charts.map do |node_attribute_chart|
              single_year_chart.merge(node_attribute_chart)
            end
            parametrised_charts.map { |chart| all_params.merge(chart) }
          end

          def single_year_chart
            {
              source: :single_year_node_values_overview,
              type: DYNAMIC_SENTENCE,
              x: nil
            }
          end

          def multi_year_charts
            parametrised_charts = attributes_charts.map do |node_attribute_chart|
              multi_year_chart.merge(node_attribute_chart)
            end
            parametrised_charts.map { |chart| all_params.merge(chart) }
          end

          def multi_year_chart
            {
              source: :multi_year_node_values_overview,
              type: BAR_CHART,
              x: :year
            }
          end

          def attributes_charts
            result = []
            Api::V3::DashboardsAttribute.all.each do |da|
              attribute = da.readonly_attribute
              result += attribute_charts(attribute)
            end
            result
          end

          def attribute_charts(attribute)
            context_meta = attribute.node_values_meta_per_context(@context)
            return [] unless context_meta.present?

            attribute_years = context_meta['years']&.compact
            is_temporal = attribute_years.any?
            if is_temporal
              # don't include charts for this attribute if years don't match
              matching_years = matching_years(attribute_years)
              return [] unless matching_years.any?
            end
            attribute_node_types_ids = context_meta['node_types_ids']
            matching_nodes = matching_nodes(attribute_node_types_ids)
            return [] unless matching_nodes.any?

            matching_nodes.map do |matching_node|
              node_attribute_chart(matching_node, attribute, is_temporal)
            end
          end

          def node_attribute_chart(node, attribute, is_temporal)
            chart = {
              cont_attribute_id: attribute.id,
              node_id: node.id,
              node_type_id: node.node_type_id,
              grouping_key: :node_id,
              grouping_label: attribute.display_name
            }
            # if it's not a temporal attribute, bar chart makes no sense
            chart = chart.merge(single_year_chart) unless is_temporal
            chart
          end

          def matching_years(attribute_years)
            attribute_years.reject do |year|
              @start_year && year < @start_year ||
                @end_year && year > @end_year
            end
          end

          def matching_nodes(attribute_node_types_ids)
            nodes =
              @sources +
              # TODO: remove once dashboards_companies_mv retired
              @companies +
              @exporters +
              @importers +
              @destinations
            nodes.select do |node|
              attribute_node_types_ids.include? node.node_type_id
            end
          end

          def all_params
            {
              country_id: @chart_params.country_id,
              commodity_id: @chart_params.commodity_id,
              start_year: @start_year,
              end_year: @end_year
            }
          end
        end
      end
    end
  end
end
