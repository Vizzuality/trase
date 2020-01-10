# TODO: is this used anywhere?
module Api
  module V3
    module Dashboards
      module SingleYearCharts
        class NcontNodeType
          attr_reader :context, :top_n, :ncont_attribute, :cont_attribute, :year, :node_type_idx

          OTHER = 'OTHER'.freeze

          class << self
            def call(chart_params:, node_type_idx:, top_n:)
              new(
                chart_params: chart_params,
                node_type_idx: node_type_idx,
                top_n: top_n
              ).call
            end
          end

          def initialize(chart_params:, node_type_idx:, top_n:)
            @context = chart_params.context
            @cont_attribute = chart_params.cont_attribute
            @ncont_attribute = chart_params.ncont_attribute
            @year = chart_params.start_year
            @node_type_idx = chart_params.node_type_idx
            @top_n = top_n
            @node_type_idx = node_type_idx
          end

          def call
            data_ncont
          end

          private

          def data_ncont
            data_by_x = {}
            top_n_and_others_query.each do |record|
              ncont_break_by_values_map.each do |break_by, idx|
                data_by_x[record['x']] ||= {}
                data_by_x[record['x']]["y#{idx}"] = record['per_break_by'][break_by]
              end
            end

            data = data_by_x.map do |key, value|
              value.symbolize_keys.merge(x: key)
            end
            data
          end

          def ncont_break_by_values_map
            Hash[ncont_break_by_values.map.with_index { |v, idx| [v, idx] }]
          end

          def ncont_break_by_values
            ncont_attribute.
              flow_values_class.
              joins(:flow).
              where(
                'flows.context_id' => context.id,
                ncont_attribute.attribute_id_name => ncont_attribute.original_id
              ).
              select(Arel.sql('value::TEXT AS text_value')).
              order(Arel.sql('value::TEXT')).
              distinct.map { |r| r['text_value'] }
          end

          def top_n_and_others_query
            subquery = <<~SQL
              (
                WITH q AS (#{flow_query.to_sql}),
                u1 AS (
                  SELECT x, JSONB_OBJECT_AGG(break_by, y0) AS per_break_by, SUM(y0) AS y
                  FROM q
                  GROUP BY x
                  ORDER BY SUM(y0) DESC LIMIT #{top_n}
                ),
                u2 AS (
                  SELECT x, JSONB_OBJECT_AGG(break_by, y0), SUM(y0) AS y
                  FROM (
                    SELECT '#{OTHER}' AS x, break_by, SUM(y0) AS y0 FROM q
                    WHERE NOT EXISTS (SELECT 1 FROM u1 WHERE q.x = u1.x)
                    GROUP BY break_by
                  ) s GROUP BY x
                )
                SELECT * FROM u1
                UNION ALL
                SELECT * FROM u2
              ) flows
            SQL
            Api::V3::Flow.from(subquery)
          end

          def flow_query
            grouped_query.
              select("#{ncont_attr_table}.value::TEXT AS break_by").
              joins("LEFT JOIN #{ncont_attr_table} ON #{ncont_attr_table}.flow_id = flows.id").
              where(
                "#{ncont_attr_table}.#{ncont_attribute.attribute_id_name}" =>
                  ncont_attribute.original_id
              ).
              group("#{ncont_attr_table}.value").
              select("SUM(#{cont_attr_table}.value) AS y0").
              joins(cont_attr_table.to_sym).
              where(
                "#{cont_attr_table}.#{cont_attribute.attribute_id_name}" =>
                  cont_attribute.original_id
              ).
              where(year: year)
          end

          def grouped_query
            Api::V3::Flow.
              from('partitioned_flows flows').
              where(context_id: context.id).
              order(false).
              select("flows.names[#{@node_type_idx}] AS x").
              group("flows.names[#{@node_type_idx}]")
          end

          def ncont_attr_table
            ncont_attribute.flow_values_class.table_name
          end

          def cont_attr_table
            cont_attribute.flow_values_class.table_name
          end
        end
      end
    end
  end
end
