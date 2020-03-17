module Api
  module V3
    module Profiles
      class TopNodesForContextList
        DEFAULT_LIMIT = 10

        def initialize(context, data)
          @context = context
          @year_start = data[:year_start]
          @year_end = data[:year_end] || @year_start
          @other_node_index =
            if (other_node_type_name = data[:other_node_type_name])
              Api::V3::NodeType.node_index_for_name(
                @context, other_node_type_name
              )
            elsif (other_node_type_id = data[:other_node_type_id])
              Api::V3::NodeType.node_index_for_id(
                @context, other_node_type_id
              )
            end
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
          query = Api::V3::Flow.select(select_clause(value_table)).
            joins(value_table_join_clause(value_table)).
            joins(nodes_join_clause).
            joins('JOIN node_properties ON nodes.id = node_properties.node_id').
            where(context_id: @context.id).
            where('NOT nodes.is_unknown').
            where("#{value_table}.#{attribute_type}_id" => attribute.id)

          unless include_domestic_consumption
            query = query.where('NOT node_properties.is_domestic_consumption')
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
          ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              [
                'flows.path[?] AS node_id',
                "SUM(#{value_table}.value)::DOUBLE PRECISION AS value",
                'nodes.name AS name',
                "node_properties.is_domestic_consumption AS \
is_domestic_consumption",
                'nodes.geo_id'
              ].join(', '),
              @other_node_index
            ]
          )
        end

        def nodes_join_clause
          ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              'JOIN nodes ON nodes.id = flows.path[?]',
              @other_node_index
            ]
          )
        end

        def value_table_join_clause(value_table)
          "JOIN partitioned_#{value_table} #{value_table} ON flows.id = #{value_table}.flow_id"
        end

        def group_clause
          ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              [
                'flows.path[?]',
                'nodes.name',
                'nodes.geo_id',
                'node_properties.is_domestic_consumption'
              ].join(', '),
              @other_node_index
            ]
          )
        end
      end
    end
  end
end
