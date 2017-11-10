shared_context 'two flows' do
  let!(:context) do
    FactoryBot.create(
      :context,
      country: FactoryBot.create(:country, name: 'BRAZIL', iso2: 'BR'),
      commodity: FactoryBot.create(:commodity, name: 'SOY')
    )
  end

  include_context 'brazil soy nodes'

  let(:exporter2_node) do
    FactoryBot.create(:node, name: 'AFG BRASIL', node_type: exporter_node_type)
  end
  let(:port2_node) do
    FactoryBot.create(:node, name: 'PARANAGUA', node_type: port_node_type)
  end
  let(:importer2_node) do
    FactoryBot.create(:node, name: 'CHINATEX GRAINS & OILS IMP EXP CO', node_type: importer_node_type)
  end
  let(:country_of_destination2_node) do
    FactoryBot.create(:node, name: 'CHINA', node_type: country_node_type)
  end
  let(:flow1) do
    FactoryBot.create(
      :flow,
      context: context,
      path: [
        biome_node, state_node, municipality_node, logistics_hub_node, port1_node, exporter1_node, importer1_node, country_of_destination1_node
      ].map(&:node_id),
      year: 2015
    )
  end
  let(:flow2) do
    FactoryBot.create(
      :flow,
      context: context,
      path: [
        biome_node, state_node, municipality_node, logistics_hub_node, port2_node, exporter2_node, importer2_node, country_of_destination2_node
      ].map(&:node_id),
      year: 2015
    )
  end
  let(:max_soy_deforestation) do
    FactoryBot.create(:quant, name: 'POTENTIAL_SOY_DEFORESTATION_V2')
  end
  let!(:context_max_soy_deforestation) do
    FactoryBot.create(
      :context_indicator, context: context, indicator: max_soy_deforestation,
                          name_in_download: 'MAX_SOY_DEFORESTATION'
    )
  end
  let(:zero_deforestation) do
    FactoryBot.create(:qual, name: 'ZERO_DEFORESTATION')
  end
  let!(:context_zero_deforestation) do
    FactoryBot.create(
      :context_indicator, context: context, indicator: zero_deforestation,
                          name_in_download: 'ZERO_DEFORESTATION'
    )
  end
  let!(:flow1_max_soy_deforestation) do
    FactoryBot.create(:flow_quant, flow: flow1, quant: max_soy_deforestation, value: 10)
  end
  let!(:flow2_max_soy_deforestation) do
    FactoryBot.create(:flow_quant, flow: flow2, quant: max_soy_deforestation, value: 5)
  end
  let!(:flow2_zero_deforestation) do
    FactoryBot.create(:flow_qual, flow: flow2, qual: zero_deforestation, value: 'yes')
  end
end
