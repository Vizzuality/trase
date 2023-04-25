module Api
  module V3
    module Profiles
      class NodesStatsList
        DEFAULT_LIMIT = 10

        def initialize(data)
          @year_start = data[:year_start]
          @year_end = data[:year_end]
          @node_id = data[:node_id]
          @node_type_id = data[:node_type_id]
        end

        def unsorted_list(quant_id, options)
          limit = limit_from_options(options)
          result = query(quant_id, options)
          result = result.limit(limit) if limit.present?
          result
        end

        def sorted_list(quant_id, options)
          unsorted_list(quant_id, options).order("value DESC")
        end

        private

        def limit_from_options(options)
          if options.key?(:limit)
            options.delete(:limit)
          else
            DEFAULT_LIMIT
          end
        end

        def query_all_years(quant_id, _options = {})
          query = Api::V3::Readonly::NodeStats.
            select(select_clause).
            where(quant_id: quant_id)

          query = query.where(node_type_id: @node_type_id) if @node_type_id

          query
        end

        def query(quant_id, options)
          if @year_start && @year_end
            query_all_years(quant_id, options).
              where(year: (@year_start..@year_end))
          else
            query_all_years(quant_id, options).
              joins("INNER JOIN contexts ON contexts.id = node_stats_mv.context_id").
              where("year = contexts.default_year")
          end
        end

        def select_clause
          ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              [
                "node_stats_mv.context_id",
                "node_stats_mv.node_id",
                "node_stats_mv.name",
                "node_stats_mv.value",
                "node_stats_mv.height",
                "node_stats_mv.quant_id",
                "node_stats_mv.geo_id"
              ].join(", ")
            ]
          )
        end
      end
    end
  end
end
