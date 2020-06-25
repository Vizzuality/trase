module Api
  module V3
    module TopNodes
      class ResponseBuilder
        attr_reader :top_nodes

        def initialize(context, params)
          @context = context
          initialize_params(params)
        end

        def call
          initialize_top_nodes
          {
            context_id: @context.id,
            indicator: @volume_attribute.display_name,
            unit: @volume_attribute.unit,
            targetNodes: @top_nodes.map do |top_node|
              value = top_node['value']
              {
                id: top_node['node_id'],
                name: top_node['name'],
                geo_id: top_node['geo_id'],
                height: value / @all_nodes_total,
                value: value
              }
            end
          }
        end

        private

        def initialize_params(params)
          node_type_id = initialize_param(params, :node_type_id)
          @node_type = Api::V3::NodeType.find(node_type_id)
          @year_start = initialize_param(params, :year_start)
          @year_end = initialize_param(params, :year_end)
          @limit = params[:limit]&.to_i || 10

          # Assumption: Volume is a special quant which always exists
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          raise 'Quant Volume not found' unless @volume_attribute.present?
        end

        def initialize_param(params, symbol)
          raise "Parameter #{symbol} missing" unless params.key?(symbol)
          params[symbol]
        end

        def initialize_top_nodes
          top_nodes_list = Api::V3::Profiles::TopNodesForContextsList.new(
            [@context],
            @node_type,
            year_start: @year_start,
            year_end: @year_end
          )
          @top_nodes = top_nodes_list.
            sorted_list(
              @volume_attribute,
              include_domestic_consumption: false,
              limit: @limit
            )
          @all_nodes_total = top_nodes_list.total(
            @volume_attribute,
            include_domestic_consumption: false
          )
        end
      end
    end
  end
end
