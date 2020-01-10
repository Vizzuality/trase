module Api
  module V3
    module Dashboards
      module SingleYearCharts
        class NoNcontNodeType
          attr_reader :context, :top_n, :cont_attribute, :year, :node_type_idx

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
            @year = chart_params.start_year
            @node_type_idx = chart_params.node_type_idx
            @top_n = top_n
            @node_type_idx = node_type_idx
          end

          def call
            data_no_ncont
          end

          private

          def data_no_ncont
            data = top_n_and_others_query.map do |r|
              r.attributes.slice('x', 'y0').symbolize_keys
            end
            if (last = data.last) && last[:x] == OTHER && last[:y0].blank?
              data.pop
            end
            data
          end

          def top_n_and_others_query
            subquery = <<~SQL
              (
                WITH q AS (#{flow_query.to_sql}),
                u1 AS (SELECT x, y0 FROM q ORDER BY y0 DESC LIMIT #{top_n}),
                u2 AS (
                  SELECT '#{OTHER}' AS x, SUM(y0) AS y0 FROM q
                  WHERE NOT EXISTS (SELECT 1 FROM u1 WHERE q.x = u1.x)
                )
                SELECT * FROM u1
                UNION ALL
                SELECT * FROM u2
              ) flows
            SQL
            Api::V3::Flow.from(subquery)
          end

          def flow_query
            Api::V3::Flow.
              from('partitioned_flows flows').
              where(context_id: context.id).order(false).
              select("flows.names[#{@node_type_idx}] AS x").
              group("flows.names[#{@node_type_idx}]").
              select("SUM(#{cont_attr_table}.value) AS y0").
              joins(cont_attr_table.to_sym).
              where(
                "#{cont_attr_table}.#{cont_attribute.attribute_id_name}" =>
                  cont_attribute.original_id
              ).
              where(year: year)
          end

          def cont_attr_table
            cont_attribute.flow_values_class.table_name
          end
        end
      end
    end
  end
end
