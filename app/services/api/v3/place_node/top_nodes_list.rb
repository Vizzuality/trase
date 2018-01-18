module Api
  module V3
    module PlaceNode
      class TopNodesList
        def initialize(context, year, node)
          @context = context
          @year = year
          @node = node
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          raise 'Quant Volume not found' unless @volume_attribute.present?
        end

        def call(node_type, include_domestic_consumption)
          initialize_top_nodes(node_type, include_domestic_consumption)

          all_nodes_for_place = Api::V3::Profiles::TopNodesList.new(
            @context, @year, @node, other_node_type_name: node_type
          ).unsorted_list(@volume_attribute, include_domestic_consumption, nil)

          {
            name: @node.name,
            indicator: @volume_attribute.display_name,
            unit: @volume_attribute.unit,
            targetNodes: @top_nodes.map do |top_node|
              node = all_nodes_for_place.find { |e| e['node_id'] == top_node['node_id'] }
              value = node && node['value']
              {
                id: top_node['node_id'],
                name: top_node['name'],
                height: top_node['value'] / @all_nodes_total,
                is_domestic_consumption: top_node['is_domestic_consumption'].present?,
                value: value
              }
            end
          }
        end

        private

        def initialize_top_nodes(node_type, include_domestic_consumption)
          top_nodes_list = Api::V3::Profiles::TopNodesList.new(
            @context, @year, @node, other_node_type_name: node_type
          )
          @top_nodes = top_nodes_list.sorted_list(
            @volume_attribute, include_domestic_consumption, 10
          )
          @all_nodes_total = top_nodes_list.total(@volume_attribute, include_domestic_consumption)
        end
      end
    end
  end
end
