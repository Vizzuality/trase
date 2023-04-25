shared_context "api v3 brazil importer quant values" do
  include_context "api v3 quants"
  include_context "api v3 brazil soy nodes"

  let!(:api_v3_importer_soy_tn_value) do
    Api::V3::NodeQuant.where(
      node_id: api_v3_importer1_node.id, quant_id: api_v3_soy_tn.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_importer1_node,
        quant: api_v3_soy_tn,
        value: 100_204,
        year: 2015
      )
  end
  let!(:api_v3_importer_potential_soy_deforestation_v2_value) do
    Api::V3::NodeQuant.where(
      node_id: api_v3_importer1_node.id, quant_id: api_v3_potential_soy_deforestation_v2.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_importer1_node,
        quant: api_v3_potential_soy_deforestation_v2,
        value: 100_204,
        year: 2015
      )
  end
  let!(:api_v3_importer_agrosatelite_soy_defor__value) do
    Api::V3::NodeQuant.where(
      node_id: api_v3_importer1_node.id, quant_id: api_v3_agrosatelite_soy_defor_.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_importer1_node,
        quant: api_v3_agrosatelite_soy_defor_,
        value: 100_204,
        year: 2015
      )
  end
  let!(:api_v3_importer_volume_value) do
    Api::V3::NodeQuant.where(
      node_id: api_v3_importer1_node.id, quant_id: api_v3_volume.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_importer1_node,
        quant: api_v3_volume,
        value: 100_204,
        year: 2015
      )
  end
  let!(:api_v3_importer_soy__value) do
    Api::V3::NodeQuant.where(
      node_id: api_v3_importer1_node.id, quant_id: api_v3_soy_.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_importer1_node,
        quant: api_v3_soy_,
        value: 11_548_228.683897123,
        year: 2015
      )
  end
end
