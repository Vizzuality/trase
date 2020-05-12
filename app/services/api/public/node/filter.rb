module Api
  module Public
    module Node
      class Filter
        attr_reader :data

        def initialize(params = {})
          initialize_params(params)
        end

        def call
          initialize_query

          apply_filters

          @query.first
        end

        private

        def initialize_params(params)
          @node_id = params[:id]
          @year = params[:year]
        end

        def initialize_query
          @query = Api::V3::Readonly::FlowNode.
            select(*select_clause).
            joins('INNER JOIN nodes_with_flows ON nodes_with_flows.id = flow_nodes.node_id').
            joins('INNER JOIN contexts_v ON contexts_v.id = flow_nodes.context_id').
            group(*group_clause).
            order('flow_nodes.node_id')
        end

        def select_clause
          [
            'flow_nodes.node_id',
            'nodes_with_flows.name',
            'nodes_with_flows.node_type',
            'nodes_with_flows.geo_id',
            'JSON_AGG(' \
              'DISTINCT JSONB_BUILD_OBJECT(' \
                '\'country\', contexts_v.iso2, ' \
                '\'commodity\', contexts_v.commodity_name, ' \
                '\'years\', nodes_with_flows.years' \
              ')' \
            ') AS availability',
            'JSON_AGG(' \
              'DISTINCT JSONB_BUILD_OBJECT(' \
                '\'country\', contexts_v.iso2, ' \
                '\'commodity\', contexts_v.commodity_name, ' \
                "'values', #{select_node_attributes_clause}" \
              ')' \
            ') AS node_attributes',
            'JSON_AGG(' \
              'DISTINCT JSONB_BUILD_OBJECT(' \
                '\'country\', contexts_v.iso2, ' \
                '\'commodity\', contexts_v.commodity_name, ' \
                '\'flow_id\', flow_nodes.flow_id, ' \
                "'values', #{select_flow_attributes_clause}" \
              ')' \
            ') AS flow_attributes'
          ]
        end

        def select_node_attributes_clause
          "#{select_node_clause('quants')} || " \
            "#{select_node_clause('quals')} || " \
            "#{select_node_clause('inds')}"
        end

        def select_node_clause(node_type)
          'ARRAY(' \
            'SELECT JSONB_BUILD_OBJECT(' \
              "'id', node_#{node_type}.#{node_type.singularize}_id, " \
              '\'year\', year, ' \
              '\'value\', value) ' \
            "FROM node_#{node_type} " \
            "WHERE node_#{node_type}.node_id = flow_nodes.node_id AND " \
              "node_#{node_type}.year = flow_nodes.year" \
          ')'
        end

        def select_flow_attributes_clause
          "#{select_flow_clause('quants')} || " \
            "#{select_flow_clause('quals')} || " \
            "#{select_flow_clause('inds')}"
        end

        def select_flow_clause(flow_type)
          'ARRAY(' \
            'SELECT JSON_BUILD_OBJECT(' \
              "'id', flow_#{flow_type}.#{flow_type.singularize}_id, " \
              '\'year\', year, ' \
              '\'value\', value) ' \
            "FROM flow_#{flow_type} " \
            "WHERE flow_#{flow_type}.flow_id = flow_nodes.flow_id" \
          ')'
        end

        def group_clause
          [
            'flow_nodes.node_id',
            'nodes_with_flows.name',
            'nodes_with_flows.node_type',
            'nodes_with_flows.geo_id',
            'contexts_v.iso2',
            'contexts_v.commodity_name'
          ]
        end

        def apply_filters
          apply_node_id_filter
          apply_year_filter
        end

        def apply_node_id_filter
          return unless @node_id

          @query = @query.where('flow_nodes.node_id' => @node_id)
        end

        def apply_year_filter
          return unless @node_id

          @query = @query.where(
            'flow_nodes.year IS NULL OR flow_nodes.year = ?', @year
          )
        end
      end
    end
  end
end
