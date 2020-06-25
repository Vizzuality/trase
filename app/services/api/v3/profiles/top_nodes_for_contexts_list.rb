module Api
  module V3
    module Profiles
      class TopNodesForContextsList
        DEFAULT_LIMIT = 10

        # @param contexts [Array<Api::V3::Context>]
        # @param node_type [Api::V3::NodeType]
        # @param options [Hash]
        # @option options [Integer] year_start
        # @option options [Integer] year_end
        def initialize(contexts, node_type, options)
          @contexts = contexts
          @node_type = node_type
          @year_start = options[:year_start]
          @year_end = options[:year_end] || @year_start
        end

        def sorted_list(attribute, options)
          limit = limit_from_options(options)
          result = query(attribute, options).order('value DESC')
          result = result.limit(limit) if limit.present?
          result
        end

        def unsorted_list_grouped_by_year(attribute, options)
          limit = limit_from_options(options)
          result = query_grouped_by_year(
            attribute, options
          )
          result = result.limit(limit) if limit.present?
          result
        end

        def total(attribute, options)
          query(attribute, options).
            except(:group).except(:select).sum(:value)
        end

        private

        def limit_from_options(options)
          if options.key?(:limit)
            options.delete(:limit)
          else
            DEFAULT_LIMIT
          end
        end

        # attribute is either a Quant or an Ind
        def query_all_years(attribute, options = {})
          include_domestic_consumption = options.
            delete(:include_domestic_consumption)
          attribute_type = attribute.class.name.demodulize.downcase
          value_table = 'flow_' + attribute_type + 's'
          query = Api::V3::Flow.
            select(select_clause(value_table)).
            joins(value_table_join_clause(value_table)).
            joins(nodes_join_clause).
            where(
              context_id: @contexts.map(&:id),
              'nodes.node_type_id' => @node_type.id,
              'nodes.is_unknown' => false,
              "#{value_table}.#{attribute_type}_id" => attribute.id
            )

          unless include_domestic_consumption
            query = query.where(
              'nodes.is_domestic_consumption' => false
            )
          end
          query.group(group_clause)
        end

        def query_grouped_by_year(attribute, options)
          query_all_years(attribute, options).
            select(:year).
            group(:year)
        end

        def query(attribute, options)
          query_all_years(attribute, options).
            where(year: (@year_start..@year_end))
        end

        def select_clause(value_table)
          [
            'flows.path[nodes.column_position + 1] AS node_id',
            "SUM(#{value_table}.value)::DOUBLE PRECISION AS value",
            'nodes.name AS name',
            'nodes.is_domestic_consumption AS is_domestic_consumption',
            'nodes.geo_id'
          ]
        end

        def nodes_join_clause
          'JOIN nodes_with_flows nodes
          ON nodes.id = flows.path[nodes.column_position + 1]
          AND nodes.context_id = flows.context_id'
        end

        def value_table_join_clause(value_table)
          "JOIN partitioned_#{value_table} #{value_table}
          ON flows.id = #{value_table}.flow_id"
        end

        def group_clause
          [
            '1',
            'nodes.name',
            'nodes.geo_id',
            'nodes.is_domestic_consumption'
          ]
        end
      end
    end
  end
end
