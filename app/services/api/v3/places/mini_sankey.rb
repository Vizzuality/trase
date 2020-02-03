module Api
  module V3
    module Places
      class MiniSankey
        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @param year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year
          # Assumption: Volume is a special quant which always exists
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          unless @volume_attribute.present?
            raise ActiveRecord::RecordNotFound.new 'Quant Volume not found'
          end
        end

        def call(node_type, include_domestic_consumption)
          initialize_top_nodes(node_type, include_domestic_consumption)

          all_nodes_for_place = Api::V3::Profiles::TopNodesList.new(
            @context,
            @node,
            year_start: @year,
            year_end: @year,
            other_node_type_name: node_type
          ).unsorted_list(
            @volume_attribute,
            include_domestic_consumption: include_domestic_consumption,
            limit: nil
          )

          {
            name: @node.name,
            indicator: @volume_attribute.display_name,
            unit: @volume_attribute.unit,
            targetNodes: @top_nodes.map do |top_node|
              top_node_id = top_node['node_id']
              node = all_nodes_for_place.find do |e|
                e['node_id'] == top_node_id
              end
              value = node && node['value']
              {
                id: top_node_id,
                name: top_node['name'],
                height: top_node['value'] / @all_nodes_total,
                is_domestic_consumption: top_node['is_domestic_consumption'].
                  present?,
                value: value
              }
            end
          }
        end

        private

        def initialize_top_nodes(node_type, include_domestic_consumption)
          top_nodes_list = Api::V3::Profiles::TopNodesList.new(
            @context,
            @node,
            year_start: @year,
            year_end: @year,
            other_node_type_name: node_type
          )
          @top_nodes = top_nodes_list.sorted_list(
            @volume_attribute,
            include_domestic_consumption: include_domestic_consumption,
            limit: 10
          )
          @all_nodes_total = top_nodes_list.total(
            @volume_attribute,
            include_domestic_consumption: include_domestic_consumption
          )
        end
      end
    end
  end
end
