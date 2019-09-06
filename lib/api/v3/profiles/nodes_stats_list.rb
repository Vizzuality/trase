module Api
  module V3
    module Profiles
      class NodesStatsList
        DEFAULT_LIMIT = 10

        def initialize(data)
          @year_start = data[:year_start]
          @year_end = data[:year_end]
          @node_type_id = data[:node_type_id]
        end

        def unsorted_list(quants_ids, options)
          limit = limit_from_options(options)
          result = query(quants_ids, options)
          result = result.limit(limit) if limit.present?
          result
        end

        def sorted_list(quants_ids, options)
          unsorted_list(quants_ids, options).order('value DESC')
        end

        private

        def limit_from_options(options)
          if options.key?(:limit)
            options.delete(:limit)
          else
            DEFAULT_LIMIT
          end
        end

        def query_all_years(quants_ids, _options = {})
          query = Api::V3::Readonly::NodesStats.
            select(select_clause).
            where(quant_id: quants_ids)

          query = query.where(node_type_id: @node_type_id) if @node_type_id

          query
        end

        def query(quants_ids, options)
          if @year_start && @year_end
            query_all_years(quants_ids, options).
              where(year: (@year_start..@year_end))
          else
            query_all_years(quants_ids, options).
              joins('INNER JOIN contexts ON contexts.id = nodes_stats_mv.context_id').
              where('year = contexts.default_year')
          end
        end

        def select_clause
          ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              [
                'nodes_stats_mv.context_id',
                'nodes_stats_mv.node_id',
                'nodes_stats_mv.name',
                'nodes_stats_mv.value',
                'nodes_stats_mv.height',
                'nodes_stats_mv.quant_id'
              ].join(', ')
            ]
          )
        end
      end
    end
  end
end
