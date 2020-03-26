module Api
  module V3
    module Dashboards
      class FilterNodes < BaseFilter
        include CallWithQueryTerm

        ORDER_BY_VOLUME = 'volume'.freeze
        ORDER_BY_NAME = 'name'.freeze

          # @see Api::V3::Dashboards::FilterNodes::BaseFilter
          # @option params [String] order_by
          # @option params [Integer] start_year
          # @option params [Integer] end_year
        def initialize(params)
          @self_ids = params.delete(param_name)
          @nodes_to_filter_by = Api::V3::Dashboards::NodesToFilterBy.new(params)
          @order_by = params.delete(:order_by)&.downcase
          super(params)
          initialize_contexts
        end

        def call_with_query_term(query_term)
          super(query_term, {include_country_id: true})
        end

        private

        # @abstract
        # @return [Symbol]
        # @raise [NotImplementedError] when not defined in subclass
        def param_name
          raise NotImplementedError
        end

        # @abstract
        # @return [Class]
        # @raise [NotImplementedError] when not defined in subclass
        def filtered_class
          raise NotImplementedError
        end

        def initialize_query
          @query = filtered_class.
            select(
              :id,
              :name,
              :node_type,
              :node_type_id
            ).
            group(
              :id,
              :name,
              :node_type,
              :node_type_id
            )
          apply_order_by
        end

        def filter_by_nodes
          return unless @node_ids.any?

          # to find all the matching paths, we need to look at node types
          # of the nodes we're filtering by
          # and for each node type we check that the path matches at least
          # one selected node
          # e.g. if someone selected 3 municipalities and 3 destinations
          # we look for flows where path matches ANY of the 3 municipalities
          # AND ANY of the 3 destinatons
          # no path can match more than pone node id of a given node type
          path_conditions = @nodes_to_filter_by.node_types_ids.map do |node_type_id|
            nodes = @nodes_to_filter_by.nodes_by_node_type_id(node_type_id)
            "flows.path && ARRAY[#{nodes.map(&:id).join(', ')}]"
          end.join(' AND ')
          # get a list of all matching nodes without checking role / position
          # because that's more complicated and identical performance-wise
          @subquery = Api::V3::Flow.
            select('UNNEST(path) AS node_id').
            where(path_conditions)
          @subquery = @subquery.where(context_id: @contexts.pluck(:id))
          @subquery = @subquery.where('year >= ?', @start_year) if @start_year
          @subquery = @subquery.where('year <= ?', @end_year) if @end_year

          @query = @query.
            joins(
              "JOIN (#{@subquery.to_sql}) s
                ON s.node_id = #{filtered_class.table_name}.id"
            )
        end

        def year_selected?
          @start_year.present?
        end

        def context_selected?
          @contexts.length == 1
        end

        def apply_order_by
          # if ordering by name specifically requested
          # or year param missing, which is required for ordering by volume
          # or context not known

          if @order_by == ORDER_BY_NAME ||
              !year_selected? ||
              !context_selected?
            apply_order_by_name
          else
            apply_order_by_volume
          end
        end

        def apply_order_by_name
          @query = @query.order(:name)
        end

        def apply_order_by_volume
          @query = @query.group(:rank_by_year)
          if @start_year && @end_year && @end_year > @start_year
            apply_order_by_average_volume
          else
            rank = "rank_by_year->'#{@start_year}'"
            @query = @query.order(Arel.sql(rank))
          end
        end

        def apply_order_by_average_volume
          years = (@start_year..@end_year).to_a
          no_of_years = years.length
          rank_sum = years.map { |y| "(rank_by_year->'#{y}')::INT" }.join(' + ')
          avg_rank = "(#{rank_sum}) / #{no_of_years}"
          @query = @query.order(Arel.sql(avg_rank))
        end
      end
    end
  end
end
