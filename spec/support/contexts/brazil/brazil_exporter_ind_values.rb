shared_context 'brazil exporter ind values' do
  include_context 'inds'
  include_context 'brazil soy nodes'

  let!(:forest_500_value) do
    FactoryBot.create(:node_ind, node: exporter1_node, ind: forest_500, value: 4)
  end
end
