class FixUniqueIndexes < ActiveRecord::Migration[5.2]
  def change
    # remove unique indexes which duplicate the unique constraint
    if index_exists?('context_properties', 'context_id', name: 'context_properties_context_id_idx')
      remove_index 'context_properties', name: 'context_properties_context_id_idx'
    end
    if index_exists?('context_node_type_properties', 'context_node_type_id', name: 'context_node_type_properties_context_node_type_id_idx')
      remove_index 'context_node_type_properties', name: 'context_node_type_properties_context_node_type_id_idx'
    end
    if index_exists?('quant_properties', 'quant_id', name: 'quant_properties_quant_id_idx')
      remove_index 'quant_properties', name: 'quant_properties_quant_id_idx'
    end
  end
end
