shared_context 'api v3 brazil exporter ind values' do
  include_context 'api v3 inds'
  include_context 'api v3 brazil soy nodes'

  let!(:api_v3_forest_500_value) do
    FactoryBot.create(
      :api_v3_node_ind,
      node: api_v3_exporter1_node,
      ind: api_v3_forest_500,
      value: 4
    )
  end
end
