require "rails_helper"

RSpec.describe Api::V3::CountryProfiles::TopSourceCountriesChart do
  include_context "api v3 node types"
  include_context "api v3 brazil context node types"
  include_context "api v3 paraguay context node types"
  include_context "api v3 brazil soy nodes"
  include_context "api v3 paraguay soy nodes"
  include_context "api v3 quants"

  let(:brazil_soy_country_of_first_import_node_fr) {
    node = FactoryBot.create(
      :api_v3_node,
      name: "FRANCE",
      node_type: api_v3_country_of_first_import_node_type,
      geo_id: "FR"
    )
    FactoryBot.create(:api_v3_node_property, node: node)
    node
  }
  let(:brazil_soy_flow_to_fr) {
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_brazil_soy_context,
      path: [
        api_v3_brazil_soy_country_of_production_node,
        api_v3_biome_node,
        api_v3_state_node,
        api_v3_municipality_node,
        api_v3_logistics_hub_node,
        api_v3_port1_node,
        api_v3_exporter1_node,
        api_v3_importer1_node,
        brazil_soy_country_of_first_import_node_fr
      ].map(&:id),
      year: 2020
    )
  }
  let(:brazil_soy_flow_volume_to_fr) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: brazil_soy_flow_to_fr,
      quant: api_v3_volume,
      value: 10
    )
  end
  let(:brazil_soy_importer_country_profile) {
    FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_brazil_soy_country_of_first_import_context_node_type,
      name: Api::V3::Profile::COUNTRY
    )
  }
  let(:brazil_soy_chart) {
    FactoryBot.create(
      :api_v3_chart,
      profile: brazil_soy_importer_country_profile,
      identifier: :country_top_consumer_countries
    )
  }
  let!(:brazil_soy_chart_node_type) {
    FactoryBot.create(
      :api_v3_chart_node_type,
      chart: brazil_soy_chart,
      node_type: api_v3_country_of_production_node_type,
      identifier: "source"
    )
  }

  let(:paraguay_soy_country_of_destination_node_fr) {
    node = FactoryBot.create(
      :api_v3_node,
      name: "FRANCE",
      node_type: api_v3_country_of_destination_node_type,
      geo_id: "FR"
    )
    FactoryBot.create(:api_v3_node_property, node: node)
    node
  }
  let(:paraguay_soy_flow_to_fr) {
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_paraguay_context,
      path: [
        api_v3_paraguay_soy_country_of_production_node,
        api_v3_paraguay_biome_node,
        api_v3_paraguay_department_node,
        api_v3_paraguay_customs_department_node,
        api_v3_paraguay_exporter_node,
        paraguay_soy_country_of_destination_node_fr
      ].map(&:id),
      year: 2020
    )
  }
  let(:paraguay_soy_flow_volume_to_fr) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: paraguay_soy_flow_to_fr,
      quant: api_v3_volume,
      value: 10
    )
  end
  let(:paraguay_soy_importer_country_profile) {
    FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_paraguay_soy_country_of_destination_context_node_type,
      name: Api::V3::Profile::COUNTRY
    )
  }
  let(:paraguay_soy_chart) {
    FactoryBot.create(
      :api_v3_chart,
      profile: paraguay_soy_importer_country_profile,
      identifier: :country_top_consumer_countries
    )
  }
  let!(:paraguay_soy_chart_node_type) {
    FactoryBot.create(
      :api_v3_chart_node_type,
      chart: paraguay_soy_chart,
      node_type: api_v3_country_of_production_node_type,
      identifier: "source"
    )
  }
  before(:each) {
    flow_quants
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
    # Api::V3::TablePartitions::CreatePartitionsForFlows.new.call
    Api::V3::TablePartitions::CreatePartitionsForFlowQuants.new.call
  }
  let(:service_object) {
    Api::V3::CountryProfiles::TopSourceCountriesChart.new(
      api_v3_soy.id,
      'FR',
      2020,
      {}
    )
  }
  context "when import country node exists as a single destination node type" do
    let(:flow_quants) { brazil_soy_flow_volume_to_fr }
    let(:expected_result) {
      {
        name: "FRANCE",
        indicator: "Trade volume",
        unit: "t",
        targetNodes: [
          {
            node_id: api_v3_brazil_soy_country_of_production_node.id,
            geo_id: api_v3_brazil_soy_country_of_production_node.geo_id,
            name: api_v3_brazil_soy_country_of_production_node.name,
            value: 10.0,
            height: 1.0
          }
        ]
      }
    }

    it "returns a single export country" do
      expect(service_object.call).to eq(expected_result)
    end
  end

  context "when import country node exists as two destination node types" do
    let(:flow_quants) { [brazil_soy_flow_volume_to_fr, paraguay_soy_flow_volume_to_fr] }
    let(:expected_result) {
      {
        name: "FRANCE",
        indicator: "Trade volume",
        unit: "t",
        targetNodes: [
          {
            node_id: api_v3_brazil_soy_country_of_production_node.id,
            geo_id: api_v3_brazil_soy_country_of_production_node.geo_id,
            name: api_v3_brazil_soy_country_of_production_node.name,
            value: 10.0,
            height: 0.50
          },
          {
            node_id: api_v3_paraguay_soy_country_of_production_node.id,
            geo_id: api_v3_paraguay_soy_country_of_production_node.geo_id,
            name: api_v3_paraguay_soy_country_of_production_node.name,
            value: 10.0,
            height: 0.50
          }
        ]
      }
    }

    it "returns two export countries" do
      expect(service_object.call).to eq(expected_result)
    end
  end
end
