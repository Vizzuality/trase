module Api
  module V3
    module PlaceNode
      class TopNodesSummary
        def initialize(context, year, node, data)
          @context = context
          @year = year
          @node = node
          @place_inds = data[:place_inds]
          @place_quants = data[:place_quants]
          @volume_attribute = data[:volume_attribute]
          initialize_top_places('quant', 'SOY_TN')
        end

        def initialize_top_places(attribute_type, attribute_name)
          value_table, dict_table = value_and_dict_tables(attribute_type)

          all_places = Api::V3::Node.
            where(node_type_id: @node.node_type_id).
            joins(value_table => attribute_type).
            where("#{dict_table}.name" => attribute_name).
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

        def call(node_list_label, node_type, top_nodes, all_nodes_total, include_domestic_consumption)
          matrix_size = @top_places_count + top_nodes.length
          matrix = Array.new(matrix_size) { Array.new(matrix_size) { 0 } }
          matrix[0] = @top_places.map { 0 } + top_nodes.map { |t| t['value'] }

          @top_places.each_with_index do |place, place_idx|
            all_nodes_for_place = TopNodesList.new(
              @context, @year, place,
              other_node_type_name: node_type,
              place_inds: @place_inds,
              place_quants: @place_quants
            ).unsorted_list(@volume_attribute, include_domestic_consumption, nil)
            top_nodes.each_with_index do |top_node, top_node_idx|
              node = all_nodes_for_place.find { |e| e['node_id'] == top_node['node_id'] }
              value = node && node['value']
              matrix[place_idx][@top_places_count + top_node_idx] = value
              matrix[@top_places_count + top_node_idx][place_idx] = value
            end
          end

          {
            node_list_label =>
              top_nodes.map do |top_node|
                {
                  id: top_node['node_id'],
                  name: top_node['name'],
                  value: top_node['value'] / all_nodes_total,
                  is_domestic_consumption: top_node['is_domestic_consumption'].present?
                }
              end,
            municipalities: @top_places.map { |place| {id: place.id, name: place.name} },
            matrix: matrix
          }
        end

        private

        def value_and_dict_tables(attribute_type)
          if attribute_type == 'quant'
            %w[node_quants quants]
          elsif attribute_type == 'ind'
            %w[node_inds inds]
          end
        end
      end
    end
  end
end
