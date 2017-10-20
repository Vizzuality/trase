shared_context 'brazil ind values' do
  include_context 'inds'
  include_context 'brazil soy nodes'

  let!(:water_scarcity_value){
    FactoryGirl.create(:node_ind, node: municipality_node, ind: water_scarcity, value: 2)
  }

  let!(:human_development_index_value){
    FactoryGirl.create(:node_ind, node: municipality_node, ind: human_development_index, value: 0.649)
  }

  let!(:gdp_per_capita_value){
    FactoryGirl.create(:node_ind, node: municipality_node, ind: gdp_per_capita, value: 3421.974, year: 2014)
  }

  let!(:gdp_from_agriculture_value){
    FactoryGirl.create(:node_ind, node: municipality_node, ind: gdp_from_agriculture, value: 35.8, year: 2013)
  }

  let!(:smallholder_dominance_value){
    FactoryGirl.create(:node_ind, node: municipality_node, ind: smallholder_dominance, value: 41.199999999999996)
  }

  let!(:soy_areaperc_value){
    FactoryGirl.create(:node_ind, node: municipality_node, ind: soy_areaperc, value: 61.69, year: 2015)
  }

  let!(:soy_yield_value){
    FactoryGirl.create(:node_ind, node: municipality_node, ind: soy_yield, value: 3.168, year: 2015)
  }
end
