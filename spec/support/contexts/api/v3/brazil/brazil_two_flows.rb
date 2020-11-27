shared_context 'api v3 brazil two flows' do
  include_context 'api v3 brazil soy nodes'
  include_context 'api v3 brazil download attributes'

  let(:api_v3_exporter2_node) do
    node = Api::V3::Node.where(
      name: 'AFG BRASIL 2', node_type_id: api_v3_exporter_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node, name: 'AFG BRASIL 2', node_type: api_v3_exporter_node_type
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let(:api_v3_port2_node) do
    node = Api::V3::Node.where(
      name: 'PARANAGUA', node_type_id: api_v3_port_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node, name: 'PARANAGUA', node_type: api_v3_port_node_type
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let(:api_v3_importer2_node) do
    node = Api::V3::Node.where(
      name: 'CHINATEX GRAINS & OILS IMP EXP CO', node_type_id: api_v3_importer_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node, name: 'CHINATEX GRAINS & OILS IMP EXP CO', node_type: api_v3_importer_node_type
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let(:api_v3_country_of_destination2_node) do
    node = Api::V3::Node.where(
      name: 'CHINA', node_type_id: api_v3_country_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node, name: 'CHINA', node_type: api_v3_country_node_type
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let!(:api_v3_flow1) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_brazil_soy_context,
      path: [
        api_v3_biome_node,
        api_v3_state_node,
        api_v3_municipality_node,
        api_v3_logistics_hub_node,
        api_v3_port1_node,
        api_v3_exporter1_node,
        api_v3_importer1_node,
        api_v3_country_of_destination1_node
      ].map(&:id),
      year: 2015
    )
  end
  let!(:api_v3_flow2) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_brazil_soy_context,
      path: [
        api_v3_biome_node,
        api_v3_state_node,
        api_v3_municipality_node,
        api_v3_logistics_hub_node,
        api_v3_port2_node,
        api_v3_exporter2_node,
        api_v3_importer2_node,
        api_v3_country_of_destination2_node
      ].map(&:id),
      year: 2015
    )
  end
  let!(:api_v3_flow2_cp) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_brazil_soy_context,
      path: [
        api_v3_biome_node,
        api_v3_state_node,
        api_v3_municipality_node,
        api_v3_logistics_hub_node,
        api_v3_port2_node,
        api_v3_exporter2_node,
        api_v3_importer2_node,
        api_v3_country_of_destination2_node
      ].map(&:id),
      year: 2015
    )
  end

  let!(:api_v3_flow1_potential_soy_deforestation_v2) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow1,
      quant: api_v3_deforestation_v2,
      value: 10
    )
  end
  let!(:api_v3_flow1_zero_deforestation) do
    FactoryBot.create(
      :api_v3_flow_qual,
      flow: api_v3_flow1,
      qual: api_v3_zero_deforestation,
      value: 'no'
    )
  end
  let!(:api_v3_flow2_potential_soy_deforestation_v2) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow2,
      quant: api_v3_deforestation_v2,
      value: 5
    )
  end
  let!(:api_v3_flow2_zero_deforestation) do
    FactoryBot.create(
      :api_v3_flow_qual,
      flow: api_v3_flow2,
      qual: api_v3_zero_deforestation,
      value: 'yes'
    )
  end
  let!(:api_v3_flow2_cp_potential_soy_deforestation_v2) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow2_cp,
      quant: api_v3_deforestation_v2,
      value: 10
    )
  end
  let!(:api_v3_flow2_cp_zero_deforestation) do
    FactoryBot.create(
      :api_v3_flow_qual,
      flow: api_v3_flow2_cp,
      qual: api_v3_zero_deforestation,
      value: 'yes'
    )
  end
end
