module Api
  module V3
    module Profiles
      class TopDestinationsList
        DEFAULT_LIMIT = 10

        def initialize(data)
          @year_start = data[:year_start]
          @year_end = data[:year_end] || @year_start
        end

        def unsorted_list(attribute, options)
          limit = limit_from_options(options)
          result = query(attribute, options)
          result = result.limit(limit) if limit.present?
          result
        end

        def sorted_list(attribute, options)
          unsorted_list(attribute, options).order('value DESC')
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
          attribute_type = attribute.class.name.demodulize.downcase
          value_table = 'flow_' + attribute_type + 's'
          query = Api::V3::Flow.select(select_clause(value_table)).
            joins(context_node_types_join_clause).
            joins(value_table_join_clause(value_table)).
            joins(nodes_join_clause).
            joins('JOIN node_properties ON nodes.id = node_properties.node_id').
            where('NOT nodes.is_unknown').
            where("#{value_table}.#{attribute_type}_id" => attribute.id).
            group(group_clause)
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
                'flows.path[context_node_types.column_position + 1] AS node_id',
                'nodes.name AS name',
                "SUM(#{value_table}.value)::DOUBLE PRECISION AS value"
              ].join(', ')
            ]
          )
        end

        def context_node_types_join_clause
          node_type = Api::V3::NodeType.find_by(name: 'COUNTRY')
          ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              'INNER JOIN context_node_types ON ' +
              'context_node_types.context_id = flows.context_id AND ' +
              'context_node_types.node_type_id = ?',
              node_type.id
            ]
          )
        end

        def nodes_join_clause
          ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              'JOIN nodes ON nodes.id = flows.path[context_node_types.column_position + 1]'
            ]
          )
        end

        def value_table_join_clause(value_table)
          "JOIN #{value_table} ON flows.id = #{value_table}.flow_id"
        end

        def group_clause
          ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              [
                'flows.path[context_node_types.column_position + 1]',
                'nodes.name',
              ].join(', ')
            ]
          )
        end
      end
    end
  end
end
