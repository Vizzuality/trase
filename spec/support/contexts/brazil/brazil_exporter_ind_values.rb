shared_context 'brazil exporter ind values' do
  include_context 'inds'
  include_context 'brazil soy nodes'

  let!(:exporter_forest_500_value) do
    NodeInd.where(node_id: exporter1_node.id, ind_id: forest_500.id, year: nil).first ||
      FactoryBot.create(:node_ind, node: exporter1_node, ind: forest_500, value: 4)
  end
end
