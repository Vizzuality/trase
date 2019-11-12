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
                "'values', #{select_node_attributes_clause}" \
              ')' \
            ') AS node_attributes',
            'JSON_AGG(' \
              'DISTINCT JSONB_BUILD_OBJECT(' \
                '\'country\', contexts_mv.iso2, ' \
                '\'commodity\', contexts_mv.commodity_name, ' \
                '\'flow_id\', flow_nodes_mv.flow_id, ' \
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
            "WHERE node_#{node_type}.node_id = flow_nodes_mv.node_id AND " \
              "node_#{node_type}.year = flow_nodes_mv.year" \
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

          @query = @query.where(
            'flow_nodes_mv.year IS NULL OR flow_nodes_mv.year = ?', @year
          )
        end
      end
    end
  end
end
