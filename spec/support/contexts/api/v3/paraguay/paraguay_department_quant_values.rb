shared_context "api v3 paraguay department quant values" do
  include_context "api v3 quants"
  include_context "api v3 paraguay soy nodes"

  let!(:api_v3_paraguay_department_area_value) do
    Api::V3::NodeQuant.where(
      node_id: api_v3_paraguay_department_node.id, quant_id: api_v3_area.id, year: nil
    ).first ||
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_paraguay_department_node,
        quant: api_v3_area,
        value: 24_577.1
      )
  end
  let!(:api_v3_paraguay_department_land_conflicts_value) do
    Api::V3::NodeQuant.where(
      node_id: api_v3_paraguay_department_node.id, quant_id: api_v3_land_conflicts.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_paraguay_department_node,
        quant: api_v3_land_conflicts,
        value: 0,
        year: 2015
      )
  end
  let!(:api_v3_paraguay_department_force_labour_value) do
    Api::V3::NodeQuant.where(
      node_id: api_v3_paraguay_department_node.id, quant_id: api_v3_force_labour.id, year: 2010
    ).first ||
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_paraguay_department_node,
        quant: api_v3_force_labour,
        value: 0,
        year: 2010
      )
  end
  let!(:api_v3_paraguay_department_embargoes_value) do
    Api::V3::NodeQuant.where(
      node_id: api_v3_paraguay_department_node.id, quant_id: api_v3_embargoes.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_paraguay_department_node,
        quant: api_v3_embargoes,
        value: 31,
        year: 2015
      )
  end
  let!(:api_v3_paraguay_department_deforestation_v2_value) do
    Api::V3::NodeQuant.where(
      node_id: api_v3_paraguay_department_node.id, quant_id: api_v3_deforestation_v2.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_paraguay_department_node,
        quant: api_v3_deforestation_v2,
        value: 0,
        year: 2015
      )
  end
  let!(:api_v3_paraguay_department_population_value) do
    Api::V3::NodeQuant.where(
      node_id: api_v3_paraguay_department_node.id, quant_id: api_v3_population.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_paraguay_department_node,
        quant: api_v3_population,
        value: 1_118_400,
        year: 2015
      )
  end
  let!(:api_v3_paraguay_department_soy_tn_value) do
    Api::V3::NodeQuant.where(
      node_id: api_v3_paraguay_department_node.id, quant_id: api_v3_soy_tn.id, year: 2015
    ).first ||
      FactoryBot.create(
        :api_v3_node_quant,
        node: api_v3_paraguay_department_node,
        quant: api_v3_soy_tn,
        value: 102_204,
        year: 2015
      )
  end
end
