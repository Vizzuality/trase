shared_context "api v3 brazil municipality qual values" do
  include_context "api v3 quals"
  include_context "api v3 brazil soy nodes"

  let!(:api_v3_state_value) do
    Api::V3::NodeQual.where(
      node_id: api_v3_municipality_node, qual_id: api_v3_state.id, year: nil
    ).first ||
      FactoryBot.create(
        :api_v3_node_qual,
        node: api_v3_municipality_node,
        qual: api_v3_state,
        value: "MATO GROSSO"
      )
  end
  let!(:api_v3_biome_value) do
    Api::V3::NodeQual.where(
      node_id: api_v3_municipality_node, qual_id: api_v3_biome.id, year: nil
    ).first ||
      FactoryBot.create(
        :api_v3_node_qual,
        node: api_v3_municipality_node,
        qual: api_v3_biome,
        value: "AMAZONIA"
      )
  end
  let!(:api_v3_zero_deforestation_value) do
    Api::V3::NodeQual.where(
      node_id: api_v3_municipality_node, qual_id: api_v3_zero_deforestation.id, year: nil
    ).first ||
      FactoryBot.create(
        :api_v3_node_qual,
        node: api_v3_municipality_node,
        qual: api_v3_zero_deforestation,
        value: "Yes"
      )
  end
  let!(:api_v3_zero_deforestation_link_value) do
    Api::V3::NodeQual.where(
      node_id: api_v3_municipality_node, qual_id: api_v3_zero_deforestation_link.id, year: nil
    ).first ||
      FactoryBot.create(
        :api_v3_node_qual,
        node: api_v3_municipality_node,
        qual: api_v3_zero_deforestation_link,
        value: "http://"
      )
  end
end
