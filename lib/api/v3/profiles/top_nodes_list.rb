module Api
  module V3
    module Profiles
      class TopNodesList
        def initialize(context, year, node, data)
          @context = context
          @year = year
          @node = node
          @self_node_index = Api::V3::NodeType.node_index_for_id(
            @context, @node.node_type_id
          )
          @other_node_index = Api::V3::NodeType.node_index_for_name(
            @context, data[:other_node_type_name]
          )
        end

        def sorted_list(attribute, include_domestic_consumption = true, limit = 10)
          result = query(attribute, include_domestic_consumption).order('value DESC')
          result = result.limit(limit) if limit.present?
          result
        end

        def unsorted_list(attribute, include_domestic_consumption = true, limit = 10)
          result = query(attribute, include_domestic_consumption)
          result = result.limit(limit) if limit.present?
          result
        end

        def unsorted_list_grouped_by_year(attribute, include_domestic_consumption = true, limit = 10)
          result = query_grouped_by_year(attribute, include_domestic_consumption)
          result = result.limit(limit) if limit.present?
          result
        end

        def total(attribute, include_domestic_consumption = true)
          query(attribute, include_domestic_consumption).
            except(:group).except(:select).sum(:value)
        end

        private

        # attribute is either a Quant or an Ind
        def query_all_years(attribute, include_domestic_consumption = true)
          attribute_type = attribute.class.name.demodulize.downcase
          value_table = 'flow_' + attribute_type + 's'
          query = Flow.select(select_clause(value_table)).
            joins("JOIN #{value_table} ON flows.id = #{value_table}.flow_id").
            joins(nodes_join_clause).
            joins('JOIN node_properties ON nodes.id = node_properties.node_id').
            where(context_id: @context.id).
            where('NOT nodes.is_unknown').
            where('? = path[?]', @node.id, @self_node_index).
            where("#{value_table}.#{attribute_type}_id" => attribute.id)

          unless include_domestic_consumption
            query = query.where('NOT node_properties.is_domestic_consumption')
          end
          query.group(group_clause)
        end

        def query_grouped_by_year(attribute, include_domestic_consumption = true)
          query_all_years(attribute, include_domestic_consumption).
            select(:year).
            group(:year)
        end

        def query(attribute, include_domestic_consumption = true)
          query_all_years(attribute, include_domestic_consumption).
            where(year: @year)
        end

        def select_clause(value_table)
          ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              [
                'flows.path[?] AS node_id',
                "SUM(#{value_table}.value)::DOUBLE PRECISION AS value",
                'nodes.name AS name',
                'node_properties.is_domestic_consumption AS is_domestic_consumption',
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
