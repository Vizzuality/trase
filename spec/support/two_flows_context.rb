shared_context "two flows" do
  let!(:context){
    FactoryGirl.create(
      :context,
      country: FactoryGirl.create(:country, name: 'BRAZIL', iso2: 'BR'),
      commodity: FactoryGirl.create(:commodity, name: 'SOY')
    )
  }
  include_context "brazil soy nodes"

  let(:exporter2){
    FactoryGirl.create(:node, name: 'AFG BRASIL', node_type: exporter_node_type)
  }
  let(:port2){
    FactoryGirl.create(:node, name: 'PARANAGUA', node_type: port_node_type)
  }
  let(:importer2){
    FactoryGirl.create(:node, name: 'CHINATEX GRAINS & OILS IMP EXP CO', node_type: importer_node_type)
  }
  let(:country_of_destination2){
    FactoryGirl.create(:node, name: 'CHINA', node_type: country_node_type)
  }
  let(:flow1){
    FactoryGirl.create(
      :flow,
      context: context,
      path: [
        biome, state, logistics_hub, municipality, exporter1, port1, importer1, country_of_destination1
      ].map(&:node_id)
    )
  }
  let(:flow2){
    FactoryGirl.create(
      :flow,
      context: context,
      path: [
        biome, state, logistics_hub, municipality, exporter2, port2, importer2, country_of_destination2
      ].map(&:node_id)
    )
  }
  let(:total_defor_rate){
    i = FactoryGirl.create(:quant, name: 'TOTAL_DEFOR_RATE')
    FactoryGirl.create(:context_indicator, context: context, indicator: i)
    i
  }
  let(:forest_500){
    i = FactoryGirl.create(:ind, name: 'FOREST_500')
    FactoryGirl.create(:context_indicator, context: context, indicator: i)
    i
  }
  let(:zero_deforestation){
    i = FactoryGirl.create(:qual, name: 'ZERO_DEFORESTATION')
    FactoryGirl.create(:context_indicator, context: context, indicator: i)
    i
  }
  let!(:flow1_total_defor_rate){
    FactoryGirl.create(:flow_quant, flow: flow1, quant: total_defor_rate, value: 10)
  }
  let!(:flow1_forest_500){
    FactoryGirl.create(:flow_ind, flow: flow1, ind: forest_500, value: 15)
  }
  let!(:flow2_total_defor_rate){
    FactoryGirl.create(:flow_quant, flow: flow2, quant: total_defor_rate, value: 5)
  }
  let!(:flow2_zero_deforestation){
    FactoryGirl.create(:flow_qual, flow: flow2, qual: zero_deforestation, value: 'yes')
  }
end