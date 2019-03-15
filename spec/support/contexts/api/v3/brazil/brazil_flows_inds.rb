shared_context 'api v3 brazil flows inds' do
  include_context 'api v3 brazil flows'
  include_context 'api v3 inds'

  let!(:api_v3_flow1_forest_500) do
    FactoryBot.create(
      :api_v3_flow_ind,
      flow: api_v3_flow1,
      ind: api_v3_forest_500,
      value: 1
    )
  end
  let!(:api_v3_flow2_forest_500) do
    FactoryBot.create(
      :api_v3_flow_ind,
      flow: api_v3_flow2,
      ind: api_v3_forest_500,
      value: 2
    )
  end
  let!(:api_v3_flow3_forest_500) do
    FactoryBot.create(
      :api_v3_flow_ind,
      flow: api_v3_flow3,
      ind: api_v3_forest_500,
      value: 3
    )
  end
  let!(:api_v3_flow4_forest_500) do
    FactoryBot.create(
      :api_v3_flow_ind,
      flow: api_v3_flow4,
      ind: api_v3_forest_500,
      value: 4
    )
  end
  let!(:api_v3_flow5_forest_500) do
    FactoryBot.create(
      :api_v3_flow_ind,
      flow: api_v3_flow5,
      ind: api_v3_forest_500,
      value: 5
    )
  end
end
