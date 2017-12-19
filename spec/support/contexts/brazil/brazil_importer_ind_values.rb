shared_context 'brazil importer ind values' do
  include_context 'inds'
  include_context 'brazil soy nodes'

  let!(:importer_forest_500_value) do
    NodeInd.where(node_id: importer1_node.id, ind_id: forest_500.id, year: nil).first ||
      FactoryBot.create(:node_ind, node: importer1_node, ind: forest_500, value: 4)
  end
end
