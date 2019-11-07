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
            joins('INNER JOIN nodes_mv ON nodes_mv.id = flow_nodes_mv.node_id').
            joins('INNER JOIN contexts_mv ON contexts_mv.id = flow_nodes_mv.context_id').
            group(*group_clause).
            order('flow_nodes_mv.node_id')
        end

        def select_clause
          [
            'flow_nodes_mv.node_id',
            'nodes_mv.name',
            'nodes_mv.node_type',
            'nodes_mv.geo_id',
            'JSON_AGG(' \
              'DISTINCT JSONB_BUILD_OBJECT(' \
                '\'country\', contexts_mv.iso2, ' \
                '\'commodity\', contexts_mv.commodity_name, ' \
                '\'years\', nodes_mv.years' \
              ')' \
            ') AS availability',
            'JSON_AGG(' \
              'DISTINCT JSONB_BUILD_OBJECT(' \
                '\'country\', contexts_mv.iso2, ' \
                '\'commodity\', contexts_mv.commodity_name, ' \
                "'node_quants', #{select_node_clause('quants')}, " \
                "'node_quals', #{select_node_clause('quals')}, " \
                "'node_inds', #{select_node_clause('inds')}" \
              ')' \
            ') AS node_indicators',
            'JSON_AGG(' \
              'DISTINCT JSONB_BUILD_OBJECT(' \
                '\'country\', contexts_mv.iso2, ' \
                '\'commodity\', contexts_mv.commodity_name, ' \
                '\'flow_id\', flow_nodes_mv.flow_id, ' \
                "'flow_quants', #{select_flow_clause('quants')}, " \
                "'flow_quals', #{select_flow_clause('quals')}, " \
                "'flow_inds', #{select_flow_clause('inds')}" \
              ')' \
            ') AS flow_indicators'
          ]
        end

        def select_node_clause(node_type)
          'ARRAY(' \
            'SELECT JSONB_BUILD_OBJECT(' \
              "'name', #{node_type}.name, " \
              '\'year\', year, ' \
              '\'value\', value) ' \
            "FROM node_#{node_type} " \
            "INNER JOIN #{node_type} ON #{node_type}.id = node_#{node_type}.#{node_type.singularize}_id " \
            "WHERE node_#{node_type}.node_id = flow_nodes_mv.node_id AND " \
              "node_#{node_type}.year = flow_nodes_mv.year" \
          ')'
        end

        def select_flow_clause(flow_type)
          'ARRAY(' \
            'SELECT JSON_BUILD_OBJECT(' \
              "'name', #{flow_type}.name, " \
              '\'year\', year, ' \
              '\'value\', value) ' \
            "FROM flow_#{flow_type} " \
            "INNER JOIN #{flow_type} ON #{flow_type}.id = flow_#{flow_type}.#{flow_type.singularize}_id " \
            "WHERE flow_#{flow_type}.flow_id = flow_nodes_mv.flow_id" \
          ')'
        end

        def group_clause
          [
            'flow_nodes_mv.node_id',
            'nodes_mv.name',
            'nodes_mv.node_type',
            'nodes_mv.geo_id',
            'contexts_mv.iso2',
            'contexts_mv.commodity_name'
          ]
        end

        def apply_filters
          apply_node_id_filter
          apply_year_filter
        end

        def apply_node_id_filter
          return unless @node_id

          @query = @query.where('flow_nodes_mv.node_id' => @node_id)
        end

        def apply_year_filter
          return unless @node_id

          @query = @query.where('flow_nodes_mv.year' => @year)
        end
      end
    end
  end
end
