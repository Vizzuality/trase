shared_context "api v3 brazil municipality ind values" do
  include_context "api v3 inds"
  include_context "api v3 brazil soy nodes"

  let!(:api_v3_water_scarcity_value) do
    Api::V3::NodeInd.where(
      node_id: api_v3_municipality_node.id, ind_id: api_v3_water_scarcity.id, year: nil
    ).first ||
      FactoryBot.create(
        :api_v3_node_ind,
        node: api_v3_municipality_node,
        ind: api_v3_water_scarcity,
        value: 2
      )
  end

  let!(:api_v3_human_development_index_value) do
    Api::V3::NodeInd.where(
      node_id: api_v3_municipality_node.id, ind_id: api_v3_human_development_index.id, year: nil
    ).first ||
      FactoryBot.create(
        :api_v3_node_ind,
        node: api_v3_municipality_node,
        ind: api_v3_human_development_index,
        value: 0.649
      )
  end

  let!(:api_v3_gdp_per_capita_value) do
    Api::V3::NodeInd.where(
      node_id: api_v3_municipality_node.id, ind_id: api_v3_gdp_per_capita.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_ind,
        node: api_v3_municipality_node,
        ind: api_v3_gdp_per_capita,
        value: 3421.974,
        year: 2015
      )
  end

  let!(:api_v3_gdp_from_agriculture_value) do
    Api::V3::NodeInd.where(
      node_id: api_v3_municipality_node.id, ind_id: api_v3_gdp_from_agriculture.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_ind,
        node: api_v3_municipality_node,
        ind: api_v3_gdp_from_agriculture,
        value: 35.8,
        year: 2015
      )
  end

  let!(:api_v3_smallholder_dominance_value) do
    Api::V3::NodeInd.where(
      node_id: api_v3_municipality_node.id, ind_id: api_v3_smallholder_dominance.id, year: nil
    ).first ||
      FactoryBot.create(
        :api_v3_node_ind,
        node: api_v3_municipality_node,
        ind: api_v3_smallholder_dominance,
        value: 41.199999999999996
      )
  end

  let!(:api_v3_soy_areaperc_value) do
    Api::V3::NodeInd.where(
      node_id: api_v3_municipality_node.id, ind_id: api_v3_soy_areaperc.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_ind,
        node: api_v3_municipality_node,
        ind: api_v3_soy_areaperc,
        value: 61.69,
        year: 2015
      )
  end

  let!(:api_v3_soy_yield_value) do
    Api::V3::NodeInd.where(
      node_id: api_v3_municipality_node.id, ind_id: api_v3_soy_yield.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_ind,
        node: api_v3_municipality_node,
        ind: api_v3_soy_yield,
        value: 3.168,
        year: 2015
      )
  end
end
