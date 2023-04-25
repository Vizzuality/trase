shared_context "api v3 brazil soy goias flows" do
  include_context "api v3 quants"

  let!(:api_v3_municipality_goias) {
    name = "GOIAS"
    node = Api::V3::Node.find_by(
      name: name, node_type_id: api_v3_municipality_node_type.id
    )
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: name,
        node_type: api_v3_municipality_node_type,
        geo_id: "BR-5208905"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  }

  let!(:api_v3_municipality_abadia_de_goias) {
    name = "ABADIA DE GOIAS"
    node = Api::V3::Node.find_by(
      name: name, node_type_id: api_v3_municipality_node_type.id
    )
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: name,
        node_type: api_v3_municipality_node_type,
        geo_id: "BR-5200050"
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  }

  let!(:api_v3_goias_flow) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_brazil_soy_context,
      path: [
        api_v3_brazil_soy_country_of_production_node,
        api_v3_biome_node,
        api_v3_state_node,
        api_v3_municipality_goias,
        api_v3_logistics_hub_node,
        api_v3_port1_node,
        api_v3_exporter1_node,
        api_v3_importer1_node,
        api_v3_country_of_first_import_node_ru
      ].map(&:id),
      year: 2015
    )
  end

  let!(:api_v3_abadia_de_goias_flow) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_brazil_soy_context,
      path: [
        api_v3_brazil_soy_country_of_production_node,
        api_v3_biome_node,
        api_v3_state_node,
        api_v3_municipality_abadia_de_goias,
        api_v3_logistics_hub_node,
        api_v3_port1_node,
        api_v3_exporter1_node,
        api_v3_importer1_node,
        api_v3_country_of_first_import_node_ru
      ].map(&:id),
      year: 2015
    )
  end

  let!(:api_v3_goias_flow_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_goias_flow,
      quant: api_v3_volume,
      value: 10
    )
  end

  let!(:api_v3_abadia_de_goias_flow_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_abadia_de_goias_flow,
      quant: api_v3_volume,
      value: 10
    )
  end
end
