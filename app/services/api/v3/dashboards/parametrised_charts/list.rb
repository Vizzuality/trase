module Api
  module V3
    module Dashboards
      module ParametrisedCharts
        class List
          attr_reader :data, :meta
          # @param chart_parameters [Api::V3::Dashboards::ChartParameters::FlowValues]
          def initialize(chart_parameters)
            @chart_parameters = chart_parameters
          end

          def call
            initialize_data
            initialize_meta
          end

          private

          def initialize_data
            @data = FlowValuesCharts.new(@chart_parameters).call +
              NodeValuesCharts.new(@chart_parameters).call
          end

          def initialize_meta
            grouped_charts = group_charts_by_grouping_key_and_value
            tmp = grouped_charts.keys.map.with_index do |key, idx|
              group = grouped_charts[key]
              group.each do |chart|
                inject_data_property(chart[:id], :grouping_id, idx)
              end
              [
                idx,
                {
                  id: idx,
                  options: group,
                  defaultChartId: group.first[:id]
                }
              ]
            end
            @meta = {groupings: Hash[tmp]}
          end

          def group_charts_by_grouping_key_and_value
            grouping_attributes = []
            @data.each.with_index do |chart, idx|
              inject_data_property(idx, :id, idx)
              grouping_key = chart.delete(:grouping_key)
              next unless grouping_key

              grouping_node_type = chart[:node_type_id]
              grouping_value = chart[grouping_key]
              grouping_attributes << {
                key: [grouping_key, grouping_node_type, grouping_value],
                id: idx,
                label: chart.delete(:grouping_label)
              }
            end
            grouping_attributes.
              group_by { |attributes| attributes.delete(:key) }.
              select { |_key, charts| charts.length > 1 }
          end

          def inject_data_property(chart_id, property_name, property_value)
            @data[chart_id][property_name] = property_value
          end
        end
      end
    end
  end
end
