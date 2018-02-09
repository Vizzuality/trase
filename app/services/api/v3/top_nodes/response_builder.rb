module Api
  module V3
    module TopNodes
      class ResponseBuilder
        attr_reader :top_nodes

        def initialize(context, year, node_type_id, limit = nil)
          @context = context
          @year = year
          @node_type_id = node_type_id
          @limit = limit || 10
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          raise 'Quant Volume not found' unless @volume_attribute.present?
        end

        def call
          top_nodes_list = Api::V3::Profiles::TopNodesForContextList.new(
            @context,
            @year,
            other_node_type_id: @node_type_id
          )
          @top_nodes = top_nodes_list.
            sorted_list(@volume_attribute, false, @limit)
          @all_nodes_total = top_nodes_list.total(
            @volume_attribute, false
          )

          {
            context_id: @context.id,
            indicator: @volume_attribute.display_name,
            unit: @volume_attribute.unit,
            targetNodes: @top_nodes.map do |top_node|
              {
                id: top_node['node_id'],
                name: top_node['name'],
                geo_id: top_node['geo_id'],
                height: top_node['value'] / @all_nodes_total,
                value: top_node['value']
              }
            end
          }
        end
      end
    end
  end
end
