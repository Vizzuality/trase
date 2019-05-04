module Api
  module V3
    module Flows
      class Filter
        attr_reader :errors, :flows, :active_nodes, :total_height, :other_nodes_ids,
                    :resize_quant, :recolor_ind, :recolor_qual
        # params:
        # node_types_ids - list of node type ids
        # resize_quant_name - Quant for resizing
        # recolor_ind_name / recolor_qual_name - Ind / Qual name for recoloring
        # (only one of these may be specified, Ind takes precedence)
        # selected_nodes_ids - list of node ids for expanding.
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
          @recolor_ind = params[:recolor_ind_name] && Api::V3::Ind.
            includes(:ind_property).
            find_by_name(params[:recolor_ind_name])
          @recolor_qual = params[:recolor_qual_name] && Api::V3::Qual.
            includes(:qual_property).
            find_by_name(params[:recolor_qual_name])
          @resize_quant = params[:resize_quant_name] && Api::V3::Quant.
            includes(:quant_property).
            find_by_name(params[:resize_quant_name])
          @selected_nodes_ids = initialize_int_set_param(
            params[:selected_nodes_ids]
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
          @errors << 'Resize quant not given' unless @resize_quant
          if @recolor_ind && @recolor_qual
            @errors << 'Either ind or qual for recoloring'
          end
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
              where('flow_quants.quant_id' => @resize_quant.id).
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

        def initialize_unknown_nodes
          # TODO: this should be happening per column
          @unknown_municipality_nodes_ids = Api::V3::Node.
            joins(:node_type).
            where(is_unknown: true).
            where('node_types.name' => NodeTypeName::MUNICIPALITY).
            pluck(:id)
        end

        def initialize_active_nodes
          active_nodes_by_position =
            if @selected_nodes.none?
              active_nodes_for_overview # overview mode
            else
              active_nodes_for_expand # expanded mode
            end

          # TODO: think about how to maybe move this out to the result object
          @total_height = active_nodes_by_position.first[1].values.
            reduce(:+)

          @errors << 'No flows found' if @total_height.zero?

          @active_nodes = active_nodes_by_position.values.
            reduce(:merge)
        end

        def active_nodes_for_overview
          active_nodes = {}
          @active_node_types_positions.map.with_index do |position, i|
            flows_through_position = flows_totals_per_node(position)
            active_nodes[position] = active_nodes_for_position(
              flows_through_position, @other_nodes_ids[i]
            )
          end
          active_nodes
        end

        def active_nodes_for_expand
          active_nodes = {}
          @active_node_types_positions.map.with_index do |position, i|
            flows_through_position = flows_totals_per_node(position)
            active_nodes[position] =
              if @selected_nodes_by_position.key?(position)
                active_nodes_for_expanded_position(
                  flows_through_position, @other_nodes_ids[i]
                )
              else
                active_nodes_for_position(
                  flows_through_position, @other_nodes_ids[i]
                )
              end
          end
          active_nodes
        end

        def active_nodes_for_position(flows_through_position, other_node_id)
          result = {other_node_id => 0}
          flows_through_position.each.with_index do |flow, i|
            if i < @limit || @locked_nodes_ids.include?(flow['node_id'])
              result[flow['node_id']] = flow['total']
            else
              result[other_node_id] += flow['total']
            end
          end
          result
        end

        def active_nodes_for_expanded_position(flows_through_position, other_node_id)
          result = {other_node_id => 0}
          flows_through_position.each do |flow|
            if @selected_nodes_ids.include?(flow['node_id']) || @locked_nodes_ids.include?(flow['node_id'])
              result[flow['node_id']] = flow['total']
            else
              result[other_node_id] += flow['total']
            end
          end
          result
        end

        def flows_totals_per_node(position)
          select_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              [
                'flows.path[?] AS node_id',
                'SUM(flow_quants.value::DOUBLE PRECISION) AS total'
              ].join(', '),
              position + 1
            ]
          )
          group_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            ['flows.path[?]', position + 1]
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

          query = basic_flows_query.
            select(select_clause).
            group(group_clause).
            order(order_clause)

          query
        end

        def flows_query
          recolor_id, recolor_value_table, recolor_column =
            if @recolor_ind
              [@recolor_ind.id, Api::V3::FlowInd.table_name, 'ind_id']
            elsif @recolor_qual
              [@recolor_qual.id, Api::V3::FlowQual.table_name, 'qual_id']
            end

          select_clause_parts = [
            'flows.id',
            'ARRAY[' +
              @active_node_types_positions.map { 'flows.path[?]' }.join(', ') +
              '] AS path',
            'flow_quants.value AS quant_value'
          ]

          if @recolor_ind
            select_clause_parts << [
              'flow_inds.value::DOUBLE PRECISION AS ind_value',
              'NULL::TEXT AS qual_value'
            ].join(', ')
          elsif @recolor_qual
            select_clause_parts << [
              'NULL::DOUBLE PRECISION AS ind_value',
              'flow_quals.value::TEXT AS qual_value'
            ].join(', ')
          end

          select_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              select_clause_parts.join(','),
              *(@active_node_types_positions.map { |ai| ai + 1 })
            ]
          )
          recolor_join_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              "LEFT JOIN #{recolor_value_table} ON \
              #{recolor_value_table}.flow_id = flows.id \
              AND #{recolor_value_table}.#{recolor_column} = ?",
              recolor_id
            ]
          )

          query = basic_flows_query.
            select(select_clause).
            where('flow_quants.value > 0')
          if recolor_id
            query = query.
              joins(recolor_join_clause)
          end
          query
        end

        def basic_flows_query
          query = Api::V3::Flow.
            joins(:flow_quants).
            where(context_id: @context.id).
            where('year >= ? AND year <= ?', @year_start, @year_end).
            where('flow_quants.quant_id' => @resize_quant.id)

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
          query
        end
      end
    end
  end
end
