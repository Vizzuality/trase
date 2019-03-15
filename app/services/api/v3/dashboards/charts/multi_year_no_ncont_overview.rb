module Api
  module V3
    module Dashboards
      module Charts
        class MultiYearNoNcontOverview
          # @param chart_parameters [Api::V3::Dashboards::ChartParameters]
          def initialize(chart_parameters)
            @cont_attribute = chart_parameters.cont_attribute
            @context = chart_parameters.context
            @start_year = chart_parameters.start_year
            @end_year = chart_parameters.end_year
            @nodes_ids_by_position = chart_parameters.nodes_ids_by_position
            initialize_query
          end

          def call
            @data = @query.map do |r|
              r.attributes.slice('x', 'y0').symbolize_keys
            end
            @meta = {
              xAxis: {
                label: 'Year',
                prefix: '',
                format: '',
                suffix: ''
              },
              yAxis: {
                label: @cont_attribute.display_name,
                prefix: '',
                format: '',
                suffix: @cont_attribute.unit
              },
              x: {
                type: 'category', # category || date || number
                label: 'Year',
                tooltip: {prefix: '', format: '', suffix: ''}
              },
              y0: {
                type: 'number',
                label: '',
                tooltip: {prefix: '', format: '', suffix: ''}
              }
            }
            {data: @data, meta: @meta}
          end

          private

          def initialize_query
            cont_attr_table = @cont_attribute.flow_values_class.table_name
            @query = Api::V3::Flow.
              select("year AS x, SUM(#{cont_attr_table}.value) AS y0").
              joins(cont_attr_table.to_sym).
              where(
                context_id: @context.id,
                "#{cont_attr_table}.#{@cont_attribute.attribute_id_name}" =>
                  @cont_attribute.original_id
              ).
              where('year BETWEEN ? AND ?', @start_year, @end_year).
              group(1)
            @nodes_ids_by_position.each do |position, nodes_ids|
              @query = @query.where('ARRAY[flows.path[?]] && ARRAY[?]', position + 1, nodes_ids)
            end
          end
        end
      end
    end
  end
end
