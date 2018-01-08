shared_context 'brazil importer quant values' do
  include_context 'quants'
  include_context 'brazil soy nodes'

  let!(:importer_soy_tn_value) do
    NodeQuant.where(node_id: importer1_node.id, quant_id: soy_tn.id, year: 2015).first ||
      FactoryBot.create(:node_quant, node: importer1_node, quant: soy_tn, value: 100_204, year: 2015)
  end
  let!(:importer_potential_soy_deforestation_v2_value) do
    NodeQuant.where(node_id: importer1_node.id, quant_id: potential_soy_deforestation_v2.id, year: 2015).first ||
      FactoryBot.create(:node_quant, node: importer1_node, quant: potential_soy_deforestation_v2, value: 100_204, year: 2015)
  end
  let!(:importer_agrosatelite_soy_defor__value) do
    NodeQuant.where(node_id: importer1_node.id, quant_id: agrosatelite_soy_defor_.id, year: 2015).first ||
      FactoryBot.create(:node_quant, node: importer1_node, quant: agrosatelite_soy_defor_, value: 100_204, year: 2015)
  end
  let!(:importer_volume_value) do
    NodeQuant.where(node_id: importer1_node.id, quant_id: volume.id, year: 2015).first ||
      FactoryBot.create(:node_quant, node: importer1_node, quant: volume, value: 100_204, year: 2015)
  end
  let!(:importer_soy__value) do
    NodeQuant.where(node_id: importer1_node.id, quant_id: soy_.id, year: 2015).first ||
      FactoryBot.create(:node_quant, node: importer1_node, quant: soy_, value: 11_548_228.683897123, year: 2015)
  end
end
