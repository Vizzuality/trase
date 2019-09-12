module Api
  module V3
    module Dashboards
      module Charts
        module FlowValuesHelpers
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
              select('nodes.id, nodes.node_type_id, nodes.name AS x, nodes.is_unknown').
              joins("JOIN nodes ON nodes.id = flows.path[#{@node_type_idx}]").
              group('nodes.id')
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

          def apply_flow_path_filters
            @chart_parameters.
              selected_nodes_ids_by_position.each do |position, nodes_ids|
                @query = @query.where(
                  'flows.path[?] IN (?)', position + 1, nodes_ids
                )
              end
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

          def series_legend_meta(series_name, attribute)
            {
              label: series_name,
              tooltip: {prefix: '', format: '', suffix: attribute.unit}
            }
          end

          def node_type_legend_meta(node_type)
            {
              label: node_type.name,
              tooltip: {prefix: '', format: '', suffix: ''}
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

          def reject_strings
            lambda { |object| object.reject { |_key, value| value.is_a? String }.compact }
          end

          def get_total_values(data)
            data.inject do |grouped, el|
              grouped.merge(el) do |_k, old_v, new_v|
                old_v + new_v
              end
            end
          end

          def flow_path_filters
            flow_path_filters = {}
            nodes = @chart_parameters.selected_nodes
            nodes_by_node_id = Hash[nodes.map { |node| [node.id, node] }]
            [:sources, :companies, :destinations].each do |filter_name|
              nodes_ids = @chart_parameters.send(:"#{filter_name}_ids")
              flow_path_filters[filter_name] = flow_path_filter(
                nodes_ids, nodes_by_node_id, profiles_by_node_type_id
              )
            end
            flow_path_filters
          end

          def flow_path_filter(nodes_ids, nodes_by_node_id, profiles_by_node_type_id)
            nodes_ids.map do |node_id|
              node = nodes_by_node_id[node_id]
              node_type = node.node_type
              profile = profiles_by_node_type_id[node.node_type_id]
              {
                id: node.id,
                name: node.name,
                node_type_id: node_type.id,
                node_type: node_type.name,
                profile: profile&.name
              }
            end
          end

          def info
            {
              node_type: @node_type.try(:name),
              years: {
                start_year: @start_year || @year,
                end_year: @end_year
              },
              top_n: @top_n,
              filter: {
                cont_attribute: @cont_attribute.try(:display_name),
                ncont_attribute: @ncont_attribute.try(:display_name)
              }.merge(flow_path_filters),
              single_filter_key: @chart_parameters.single_filter_key
            }
          end
        end
      end
    end
  end
end
