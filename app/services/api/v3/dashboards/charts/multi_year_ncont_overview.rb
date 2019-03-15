module Api
  module V3
    module Dashboards
      module Charts
        class MultiYearNcontOverview
          # @param chart_parameters [Api::V3::Dashboards::ChartParameters]
          def initialize(chart_parameters)
            @cont_attribute = chart_parameters.cont_attribute
            @context = chart_parameters.context
            @start_year = chart_parameters.start_year
            @end_year = chart_parameters.end_year
            @ncont_attribute = chart_parameters.ncont_attribute
            @nodes_ids_by_position = chart_parameters.nodes_ids_by_position
            initialize_query
          end

          def call
            break_by_values_indexes = Hash[
              break_by_values.map.with_index { |v, idx| [v, idx] }
            ]
            data_by_x = {}
            @query.each do |record|
              idx = break_by_values_indexes[record['break_by']]
              data_by_x[record['x']] ||= {}
              data_by_x[record['x']]["y#{idx}"] = record['y']
            end

            @data = data_by_x.map do |key, value|
              value.symbolize_keys.merge(x: key)
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
              }
            }

            break_by_values_indexes.each do |break_by, idx|
              @meta[:"y#{idx}"] = {
                type: 'category',
                label: break_by,
                tooltip: {prefix: '', format: '', suffix: ''}
              }
            end

            {data: @data, meta: @meta}
          end

          private

          def initialize_query
            cont_attr_table = @cont_attribute.flow_values_class.table_name
            ncont_attr_table = @ncont_attribute.flow_values_class.table_name
            @query = Api::V3::Flow.
              select([
                'year AS x',
                "#{ncont_attr_table}.value AS break_by",
                "SUM(#{cont_attr_table}.value) AS y"
              ]).
              joins(cont_attr_table.to_sym).
              joins("LEFT JOIN #{ncont_attr_table} ON #{ncont_attr_table}.flow_id = flows.id").
              where(
                context_id: @context.id,
                "#{cont_attr_table}.#{@cont_attribute.attribute_id_name}" =>
                  @cont_attribute.original_id,
                "#{ncont_attr_table}.#{@ncont_attribute.attribute_id_name}" =>
                  @ncont_attribute.original_id
              ).
              where('year BETWEEN ? AND ?', @start_year, @end_year).
              group(1, 2)

            @nodes_ids_by_position.each do |position, nodes_ids|
              @query = @query.where('ARRAY[flows.path[?]] && ARRAY[?]', position + 1, nodes_ids)
            end
          end

          def break_by_values
            @ncont_attribute.
              flow_values_class.
              where(@ncont_attribute.attribute_id_name => @ncont_attribute.original_id).
              select(:value).
              order(:value).
              distinct.
              map(&:value)
          end
        end
      end
    end
  end
end
