shared_context 'brazil municipality ind values' do
  include_context 'inds'
  include_context 'brazil soy nodes'

  let!(:water_scarcity_value) do
    FactoryGirl.create(:node_ind, node: municipality_node, ind: water_scarcity, value: 2)
  end

  let!(:human_development_index_value) do
    FactoryGirl.create(:node_ind, node: municipality_node, ind: human_development_index, value: 0.649)
  end

  let!(:gdp_per_capita_value) do
    FactoryGirl.create(:node_ind, node: municipality_node, ind: gdp_per_capita, value: 3421.974, year: 2014)
  end

  let!(:gdp_from_agriculture_value) do
    FactoryGirl.create(:node_ind, node: municipality_node, ind: gdp_from_agriculture, value: 35.8, year: 2013)
  end

  let!(:smallholder_dominance_value) do
    FactoryGirl.create(:node_ind, node: municipality_node, ind: smallholder_dominance, value: 41.199999999999996)
  end

  let!(:soy_areaperc_value) do
    FactoryGirl.create(:node_ind, node: municipality_node, ind: soy_areaperc, value: 61.69, year: 2015)
  end

  let!(:soy_yield_value) do
    FactoryGirl.create(:node_ind, node: municipality_node, ind: soy_yield, value: 3.168, year: 2015)
  end
end
