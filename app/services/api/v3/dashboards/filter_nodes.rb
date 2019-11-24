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

          @query = @query.where("nodes_ids && ARRAY[#{@node_ids.join(',')}]")
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
