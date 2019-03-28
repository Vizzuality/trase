module Api
  module V3
    module Dashboards
      module Charts
        module Helpers
          private

          def flow_query
            Api::V3::Flow.where(context_id: @context.id).order(false)
          end

          def apply_cont_attribute_y
            cont_attr_table = @cont_attribute.flow_values_class.table_name
            @query = @query.
              select("SUM(#{cont_attr_table}.value) AS y0").
              joins(cont_attr_table.to_sym).
              where(
                "#{cont_attr_table}.#{@cont_attribute.attribute_id_name}" =>
                  @cont_attribute.original_id
              )
          end

          def apply_ncont_attribute_x
            ncont_attr_table = @ncont_attribute.flow_values_class.table_name
            @query = @query.
              select("#{ncont_attr_table}.value AS x").
              joins("LEFT JOIN #{ncont_attr_table} ON #{ncont_attr_table}.flow_id = flows.id").
              where(
                "#{ncont_attr_table}.#{@ncont_attribute.attribute_id_name}" =>
                  @ncont_attribute.original_id
              ).
              group("#{ncont_attr_table}.value")
          end

          def apply_node_type_x
            @query = @query.
              select('nodes.name AS x').
              joins("JOIN nodes ON nodes.id = flows.path[#{@node_type_idx}]").
              group('nodes.name')
          end

          def apply_year_x
            @query = @query.select('year AS x').group(:year)
          end

          def apply_ncont_attribute_break_by
            ncont_attr_table = @ncont_attribute.flow_values_class.table_name
            @query = @query.
              select("#{ncont_attr_table}.value::TEXT AS break_by").
              joins("LEFT JOIN #{ncont_attr_table} ON #{ncont_attr_table}.flow_id = flows.id").
              where(
                "#{ncont_attr_table}.#{@ncont_attribute.attribute_id_name}" =>
                  @ncont_attribute.original_id
              ).
              group("#{ncont_attr_table}.value")
          end

          def apply_single_year_filter
            @query = @query.where(year: @year)
          end

          def apply_multi_year_filter
            @query = @query.where('year BETWEEN ? AND ?', @start_year, @end_year)
          end

          def apply_flow_path_filters
            @nodes_ids_by_position.each do |position, nodes_ids|
              @query = @query.where(
                'flows.path[?] IN (?)', position + 1, nodes_ids
              )
            end
          end

          def axis_meta(attribute, type)
            {
              type: type,
              label: attribute.display_name,
              prefix: '',
              format: '',
              suffix: attribute.unit
            }
          end

          def node_type_axis_meta(node_type)
            {
              type: 'category',
              label: node_type.name,
              prefix: '',
              format: '',
              suffix: ''
            }
          end

          def year_axis_meta
            {
              type: 'category', # category || date || number
              label: 'Year',
              prefix: '',
              format: '',
              suffix: ''
            }
          end

          def legend_meta(attribute)
            {
              label: attribute.display_name,
              tooltip: {prefix: '', format: '', suffix: attribute.unit}
            }
          end

          def node_type_legend_meta(node_type)
            {
              label: node_type.name,
              tooltip: {prefix: '', format: '', suffix: ''}
            }
          end

          def year_legend_meta
            {
              label: 'Year', tooltip: {prefix: '', format: '', suffix: ''}
            }
          end

          def ncont_break_by_values
            @ncont_attribute.
              flow_values_class.
              joins(:flow).
              where(
                'flows.context_id' => @context.id,
                @ncont_attribute.attribute_id_name => @ncont_attribute.original_id
              ).
              select(Arel.sql('value::TEXT AS text_value')).
              order(Arel.sql('value::TEXT')).
              distinct.map { |r| r['text_value'] }
          end

          def ncont_break_by_values_map
            Hash[
              ncont_break_by_values.map.with_index { |v, idx| [v, idx] }
            ]
          end

          def swap_x_and_y
            @data = @data.map do |object|
              swap_x_and_y_keys_in_hash(object)
            end
            @meta = swap_x_and_y_keys_in_hash(@meta)
          end

          def swap_x_and_y_keys_in_hash(input)
            output = {}
            input.keys.each do |old_key|
              new_key =
                if old_key =~ /^x(.*)/
                  :"y#{$1}"
                elsif old_key =~ /^y(.*)/
                  :"x#{$1}"
                else
                  old_key
                end
              output[new_key] = input[old_key]
            end
            output
          end
        end
      end
    end
  end
end
