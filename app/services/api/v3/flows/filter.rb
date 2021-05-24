module Api
  module V3
    module Flows
      class Filter
        attr_reader :errors, :flows, :active_nodes, :total_height, :other_nodes,
                    :cont_attribute, :ncont_attribute
        # params:
        # node_types_ids - list of node type ids
        # cont_attribute_id - Quant for resizing
        # ncont_attribute_id - Ind / Qual for recoloring
        # (only one of these may be specified, Ind takes precedence)
        # selected_nodes_ids - list of node ids for expanding
        # excluded_nodes_ids
        # biome_id - id of biome to filter by
        # year_start
        # year_end
        # limit
        def initialize(context, params)
          @context = context
          initialize_params(params)
          initialize_errors
        end

        def call
          if @errors.any?
            return Api::V3::Flows::Result.new(self)
          end
          initialize_node_types
          initialize_active_node_types
          initialize_biome_position
          initialize_selected_nodes
          initialize_other_nodes_ids
          initialize_excluded_nodes
          initialize_unknown_nodes
          if @errors.none?
            initialize_active_nodes
            @flows = flows_query.all
          end
          Api::V3::Flows::Result.new(self)
        end

        private

        def initialize_params(params)
          @node_types_ids = initialize_int_set_param(params[:node_types_ids])
          context_id = @context.id
          cont_attribute_id = params[:cont_attribute_id]
          ncont_attribute_id = params[:ncont_attribute_id]
          @ncont_attribute = ncont_attribute_id &&
            Api::V3::Readonly::RecolorByAttribute.
              select(:attribute_id).
              includes(:readonly_attribute).
              find_by_context_id_and_attribute_id(
                context_id, ncont_attribute_id
              )&.readonly_attribute
          @cont_attribute = cont_attribute_id &&
            Api::V3::Readonly::ResizeByAttribute.
              select(:attribute_id).
              includes(:readonly_attribute).
              find_by_context_id_and_attribute_id(
                context_id, cont_attribute_id
              )&.readonly_attribute
          @selected_nodes_ids = initialize_int_set_param(
            params[:selected_nodes_ids]
          )
          @excluded_nodes_ids = initialize_int_set_param(
            params[:excluded_nodes_ids]
          )
          @locked_nodes_ids = initialize_int_set_param(
            params[:locked_nodes_ids]
          )
          @biome_id = params[:biome_id]
          @year_start = params[:year_start]
          @year_end = params[:year_end]
          @limit = params[:limit]&.to_i || 100
        end

        def initialize_int_set_param(param)
          ary = param || []
          ary = ary.split(',') if ary.is_a?(String)
          ary.map(&:to_i).to_set # for fast lookups
        end

        def initialize_errors
          @errors = []
          @errors << 'Context not given' unless @context
          unless @year_start && @year_end
            @errors << 'Both start and end date not given'
          end
          @errors << 'Cont attribute not given' unless @cont_attribute
          return if @node_types_ids.any?
          @errors << 'No columns given'
        end

        def initialize_node_types
          @node_types = Api::V3::NodeType.
            select(
              [
                'node_types.id AS id',
                'node_types.name AS name',
                'context_node_types.column_position',
                'context_node_type_properties.column_group'
              ]
            ).
            joins(context_node_types: :context_node_type_property).
            where('context_node_types.context_id' => @context.id).
            where('context_node_type_properties.is_visible').
            order('context_node_types.column_position ASC')
          @errors << 'No node types for context' unless @node_types.any?
        end

        # columns to be displayed on frontend
        # it should be possible to support variable number of columns
        # but it should not be possible to select more than one column from
        # same column group
        def initialize_active_node_types
          @active_node_types = @node_types.select do |c|
            @node_types_ids.include?(c['id'])
          end
          # TODO: do not allow to select more than one column from same group
          @active_node_types_positions = @active_node_types.map(&:column_position)
        end

        def initialize_biome_position
          @biome_position = @biome_id && @node_types.index do |c|
            c['name'] == NodeTypeName::BIOME
          end + 1
        end

        # nodes selected by the user
        def initialize_selected_nodes
          # filter out nodes not involved in any flows in this context
          @selected_nodes_ids = @selected_nodes_ids.select do |node_id|
            Api::V3::Flow.
              select('true').
              joins(:flow_quants).
              where('flow_quants.quant_id' => @cont_attribute.original_id).
              where(context_id: @context.id). # TODO: verify this
              where('? = ANY(flows.path)', node_id).
              where('year >= ? AND year <= ?', @year_start, @year_end).any?
          end
          @selected_nodes = Api::V3::Node.where(
            id: @selected_nodes_ids,
            node_type_id: @node_types_ids.to_a
          ).all

          @selected_nodes_by_position = @selected_nodes.group_by do |node|
            @active_node_types.find do |nt|
              nt.id == node.node_type_id
            end.column_position
          end
        end

        def initialize_other_nodes_ids
          @other_nodes_ids = @active_node_types.map do |node_type|
            Api::V3::Node.where(node_type_id: node_type.id, name: 'OTHER').
              pluck(:id).first
            # TODO: maybe we could not rely on those nodes in db?
            # problem is the id of those nodes is referenced
          end
        end

        def initialize_excluded_nodes
          # filter out nodes not involved in any flows in this context
          @excluded_nodes_ids = @excluded_nodes_ids.select do |node_id|
            Api::V3::Flow.
              select('true').
              joins(:flow_quants).
              where('flow_quants.quant_id' => @cont_attribute.original_id).
              where(context_id: @context.id). # TODO: verify this
              where('NOT(? = ANY(flows.path))', node_id).
              where('year >= ? AND year <= ?', @year_start, @year_end).any?
          end
          @excluded_nodes = Api::V3::Node.where(
            id: @excluded_nodes_ids,
            node_type_id: @node_types_ids.to_a
          ).all

          @excluded_nodes_by_position = @excluded_nodes.group_by do |node|
            @active_node_types.find do |nt|
              nt.id == node.node_type_id
            end.column_position
          end
        end

        def initialize_unknown_nodes
          # TODO: this should be happening per column
          @unknown_municipality_nodes_ids = Api::V3::Node.
            joins(:node_type).
            where(is_unknown: true).
            where('node_types.name' => NodeTypeName::MUNICIPALITY).
            pluck(:id)
        end

        def initialize_active_nodes
          active_nodes_by_position, @other_nodes =
            if @selected_nodes.none?
              nodes_for_overview # overview mode
            else
              nodes_for_expand # expanded mode
            end

          @active_nodes_ids_by_position = Hash[
            active_nodes_by_position.map do |position, nodes|
              [position, nodes.keys]
            end
          ]

          # TODO: think about how to maybe move this out to the result object
          @total_height = active_nodes_by_position.first[1].values.
            reduce(:+)

          @errors << 'No flows found' if @total_height.zero?

          @active_nodes = active_nodes_by_position.values.
            reduce(:merge)
        end

        def nodes_for_overview
          active_nodes = {}
          other_nodes = []
          @active_node_types_positions.map.with_index do |position, i|
            flows_through_position = flows_totals_per_node(position)
            active_nodes[position], other_nodes[i] =
              active_nodes_for_position(
                flows_through_position, @other_nodes_ids[i]
              )
          end
          [active_nodes, other_nodes]
        end

        def nodes_for_expand
          active_nodes = {}
          other_nodes = []
          @active_node_types_positions.map.with_index do |position, i|
            flows_through_position = flows_totals_per_node(position)
            other_node_id = @other_nodes_ids[i]
            active_nodes[position], other_nodes[i] =
              if @selected_nodes_by_position.key?(position)
                active_nodes_for_expanded_position(
                  flows_through_position, other_node_id
                )
              else
                active_nodes_for_position(
                  flows_through_position, other_node_id
                )
              end
          end
          [active_nodes, other_nodes]
        end

        def active_nodes_for_position(flows_through_position, other_node_id)
          result = {other_node_id => 0}
          other = {id: other_node_id, count: 0}
          flows_through_position.each.with_index do |flow, i|
            if i < @limit || @locked_nodes_ids.include?(flow['node_id'])
              result[flow['node_id']] = flow['total']
            else
              result[other_node_id] += flow['total']
              other[:count] += 1
            end
          end
          [result, other]
        end

        def active_nodes_for_expanded_position(flows_through_position, other_node_id)
          result = {other_node_id => 0}
          other = {id: other_node_id, count: 0}
          flows_through_position.each do |flow|
            if @selected_nodes_ids.include?(flow['node_id']) || @locked_nodes_ids.include?(flow['node_id'])
              result[flow['node_id']] = flow['total']
            else
              result[other_node_id] += flow['total']
              other[:count] += 1
            end
          end
          [result, other]
        end

        def flows_totals_per_node(position)
          select_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              [
                'year',
                'flows.path[?] AS node_id',
                "SUM(flow_quants.value::DOUBLE PRECISION) AS total"
              ].join(', '),
              position + 1
            ]
          )
          group_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            ['year, flows.path[?]', position + 1]
          )
          # if there are unknowns, push them to the bottom
          # currently works for the first column only
          # TODO: should work for all the columns
          if @unknown_municipality_nodes_ids.any?
            order_by_unknown_clause = ActiveRecord::Base.send(
              :sanitize_sql_array,
              [
                'CASE WHEN flows.path[?] = ANY(ARRAY[?]) THEN 2 ELSE 1 END',
                position + 1, @unknown_municipality_nodes_ids
              ]
            )
            order_by_unknown_clause = Arel.sql(order_by_unknown_clause)
          end
          order_clause = [
            order_by_unknown_clause, 'total DESC'
          ].compact

          subquery = basic_flows_query.
            select(select_clause).
            group(group_clause).
            order(order_clause)

          Api::V3::Flow.
            from("(#{subquery.to_sql}) s").
            select("node_id, #{@cont_attribute.aggregation_method}(total) AS total").
            group('node_id')
        end

        def flows_query
          case_expressions, case_substitutions = [], []
          @active_node_types_positions.map.with_index do |position, i|
            case_expressions <<
              'CASE WHEN flows.path[?] IN (?) THEN flows.path[?] ELSE ? END'
            other_node_id = @other_nodes_ids[i]
            nodes_ids = @active_nodes_ids_by_position[position].
              reject { |e| e == other_node_id}
            case_substitutions += [
              position + 1, nodes_ids, position + 1, other_node_id
            ]
          end
          select_clause_path = ActiveRecord::Base.send(
            :sanitize_sql_array, ['ARRAY[' + case_expressions.join(', ') + '] AS path', *case_substitutions]
          )
          cont_attr_table = @cont_attribute.flow_values_class.table_name
          subquery_select_clause_parts = [
            'year',
            select_clause_path,
            "SUM(#{cont_attr_table}.value) AS quant_value"
          ]
          query_select_clause_parts = [
            'path',
            "#{@cont_attribute.aggregation_method}(quant_value) AS quant_value"
          ]

          if @ncont_attribute
            subquery_select_clause_parts << select_clause_ncont_attribute
            query_select_clause_parts += ['ind_value', 'qual_value']
          end

          subquery = basic_flows_query.
            select(subquery_select_clause_parts.join(',')).
            where("#{cont_attr_table}.value > 0").
            group('1,2') # year and path

          if @ncont_attribute
            ncont_attr_table = @ncont_attribute.flow_values_class.table_name
            ncont_attr_join_clause = ActiveRecord::Base.send(
              :sanitize_sql_array,
              [
                "LEFT JOIN partitioned_#{ncont_attr_table} #{ncont_attr_table} ON \
                #{ncont_attr_table}.flow_id = flows.id \
                AND #{ncont_attr_table}.#{@ncont_attribute.attribute_id_name} = ?",
                @ncont_attribute.original_id
              ]
            )
            subquery = subquery.
              joins(ncont_attr_join_clause).
              group("#{ncont_attr_table}.value")
          end
          query = Api::V3::Flow.
            from("(#{subquery.to_sql}) s").
            select(query_select_clause_parts.join(',')).
            group('1') # path
          query = query.group('ind_value, qual_value') if @ncont_attribute
          query
        end

        def select_clause_ncont_attribute
          ncont_attr_table = @ncont_attribute.flow_values_class.table_name
          if @ncont_attribute.ind?
            [
              "#{ncont_attr_table}.value::DOUBLE PRECISION AS ind_value",
              'NULL::TEXT AS qual_value'
            ].join(', ')
          elsif @ncont_attribute.qual?
            [
              'NULL::DOUBLE PRECISION AS ind_value',
              "#{ncont_attr_table}.value::TEXT AS qual_value"
            ].join(', ')
          end
        end

        def basic_flows_query
          cont_attr_table = @cont_attribute.flow_values_class.table_name
          query = Api::V3::Flow.
            from('partitioned_flows flows').
            joins("JOIN partitioned_#{cont_attr_table} #{cont_attr_table} ON #{cont_attr_table}.flow_id = flows.id").
            where(context_id: @context.id).
            where('year >= ? AND year <= ?', @year_start, @year_end).
            where(
              "#{cont_attr_table}.#{@cont_attribute.attribute_id_name}" =>
                @cont_attribute.original_id
            )

          if @biome_position
            query = query.where('path[?] = ?', @biome_position, @biome_id)
          end

          if @selected_nodes.any?
            @selected_nodes_by_position.each do |position, nodes_ids|
              query = query.where(
                'flows.path[?] = ANY(ARRAY[?])',
                position + 1,
                nodes_ids
              )
            end
          end

          if @excluded_nodes.any?
            @excluded_nodes_by_position.each do |position, nodes_ids|
              query = query.where(
                'NOT(flows.path[?] = ANY(ARRAY[?]))',
                position + 1,
                nodes_ids
              )
            end
          end

          query
        end
      end
    end
  end
end
