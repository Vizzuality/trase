module Api
  module V3
    module PlaceNode
      class TopNodesSummary
        def initialize(context, year, node)
          @context = context
          @year = year
          @node = node
          @volume_attribute = Dictionary::Quant.instance.get('Volume')
          @soy_production_attribute = Dictionary::Quant.instance.get('SOY_TN')
          initialize_top_places(@soy_production_attribute)
        end

        def call(node_list_label, node_type, include_domestic_consumption)
          initialize_top_nodes(node_type, include_domestic_consumption)
          matrix_size = @top_places_count + @top_nodes.length
          matrix = Array.new(matrix_size) { Array.new(matrix_size) { 0 } }
          matrix[0] = @top_places.map { 0 } + @top_nodes.map { |t| t['value'] }

          @top_places.each_with_index do |place, place_idx|
            all_nodes_for_place = Api::V3::Profiles::TopNodesList.new(
              @context, @year, place, other_node_type_name: node_type
            ).unsorted_list(@volume_attribute, include_domestic_consumption, nil)
            @top_nodes.each_with_index do |top_node, top_node_idx|
              node = all_nodes_for_place.find { |e| e['node_id'] == top_node['node_id'] }
              value = node && node['value']
              matrix[place_idx][@top_places_count + top_node_idx] = value
              matrix[@top_places_count + top_node_idx][place_idx] = value
            end
          end

          {
            node_list_label =>
              @top_nodes.map do |top_node|
                {
                  id: top_node['node_id'],
                  name: top_node['name'],
                  value: top_node['value'] / @all_nodes_total,
                  is_domestic_consumption: top_node['is_domestic_consumption'].present?
                }
              end,
            municipalities: @top_places.map { |place| {id: place.id, name: place.name} },
            matrix: matrix
          }
        end

        private

        def initialize_top_places(attribute)
          attribute_type = attribute.class.name.demodulize.downcase
          value_table = 'node_' + attribute_type + 's'

          all_places = Api::V3::Node.
            where(node_type_id: @node.node_type_id).
            joins(value_table => attribute_type).
            where("#{value_table}.#{attribute_type}_id" => attribute.id).
            where('nodes.id <> ?', @node.id). # do not double count current
            select(
              'nodes.id',
              'nodes.node_type_id',
              'nodes.name',
              'SUM(node_quants.value) AS value'
            ).
            where('node_quants.year' => @year).
            group('nodes.id, nodes.name').
            order('value desc')

          @top_places = [@node] + all_places.limit(9).all
          @top_places_count = @top_places.length
        end

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
