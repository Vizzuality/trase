namespace :validate do
  task get_node_attributes: :environment do
    node_ids = Node.
      select('node_id').
      joins('LEFT JOIN context_nodes ON nodes.node_type_id = context_nodes.node_type_id').
      where('context_nodes.context_id = ?', 1)

    ind_values = NodeInd.get_attributes_for_nodes(node_ids, 1, 2015, 2015)

    quant_values = NodeQuant.get_attributes_for_nodes(node_ids, 1, 2015, 2015)

    api_values = (ind_values + quant_values)

    puts 'Loaded model data, loading reference values...'

    reference_json = Oj.load(File.read("#{Rails.root}/spec/support/reference_responses/get_nodes_brazil_soy.json"))['data']

    puts 'Loaded reference data, indexing...'

    reference_values = reference_json.index_by { |value| value['id'] }

    puts 'Reference data indexed, cross-checking'

    api_values.each do |api_value|
      if reference_values[api_value.node_id].nil?
        puts "Node #{api_value.node_id} has data on new API response, but not on the old one. Confirm this is not a bug."
        next
      end

      reference_node_data = reference_values[api_value.node_id]

      things = reference_node_data['values'].select { |item| api_value.attribute_type.casecmp(item['type']) === 0 && api_value.attribute_id === item['id'] }

      if things.length > 1
        raise "Node #{api_value.node_id} has multiple values for attribute type #{api_value.attribute_type} with attribute id #{api_value.attribute_id}. This should really never happen..."
      end

      unless things.any?
        raise "Node #{api_value.node_id} has no values for attribute type #{api_value.attribute_type} with attribute id #{api_value.attribute_id}. This should really never happen..."
      end

      unless things.first['rawValue'].present? and api_value.value.present? and things.first['value3'].present? and api_value.bucket3.present? and things.first['value5'].present? and api_value.bucket5.present?
        raise "Missing data for #{api_value.node_id}. Cannot compare"
      end

      if things.first['rawValue'] != api_value.value or things.first['value3'] != api_value.bucket3 or things.first['value5'] != api_value.bucket5
        raise "Node #{api_value.node_id} has mismatching values for attribute type #{api_value.attribute_type} with attribute id #{api_value.attribute_id}. This most likely means a bug in get_node_attributes"
      end
    end

    puts 'Congratulations, your code is bug-free.'
  end
end
