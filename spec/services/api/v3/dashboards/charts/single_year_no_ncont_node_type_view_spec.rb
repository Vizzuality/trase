require "rails_helper"

RSpec.describe Api::V3::Dashboards::Charts::SingleYearNoNcontNodeTypeView do
  include_context "api v3 brazil resize by attributes"
  include_context "api v3 brazil soy flow quants"

  let!(:api_v3_unknown_biome_node) do
    node = Api::V3::Node.where(
      name: "UNKNOWN", node_type_id: api_v3_biome_node_type.id
    ).first
    unless node
      node = FactoryBot.create(
        :api_v3_node,
        name: "UNKNOWN",
        node_type: api_v3_biome_node_type,
        is_unknown: true
      )
      FactoryBot.create(
        :api_v3_node_property,
        node: node
      )
    end
    node
  end

  let!(:api_v3_flow_with_unknown) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_brazil_soy_context,
      path: [
        api_v3_brazil_soy_country_of_production_node,
        api_v3_unknown_biome_node,
        api_v3_state_node,
        api_v3_municipality_node,
        api_v3_logistics_hub_node,
        api_v3_port1_node,
        api_v3_exporter1_node,
        api_v3_importer1_node,
        api_v3_country_of_first_import_node_ru
      ].map(&:id),
      year: 2015
    )
  end

  let!(:api_v3_flow_with_unknown_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow_with_unknown,
      quant: api_v3_volume,
      value: 100
    )
  end

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::TablePartitions::CreatePartitionsForFlows.new.call
    Api::V3::TablePartitions::CreatePartitionsForFlowQuants.new.call
  end

  let(:cont_attribute) { api_v3_volume.readonly_attribute }
  let(:node_type) { api_v3_biome_node_type }

  let(:shared_parameters_hash) {
    {
      country_id: api_v3_brazil.id,
      commodity_id: api_v3_soy.id,
      cont_attribute_id: cont_attribute.id,
      node_type_id: node_type.id,
      start_year: 2015,
      top_n: 10
    }
  }

  let(:chart_parameters) {
    Api::V3::Dashboards::ChartParameters::FlowValues.new(parameters_hash)
  }

  let(:result) {
    Api::V3::Dashboards::Charts::SingleYearNoNcontNodeTypeView.new(
      chart_parameters
    ).call
  }

  let(:data) { result[:data] }

  describe :call do
    context "when no flow path filters" do
      let(:parameters_hash) { shared_parameters_hash }
      it "summarized all flows per biome" do
        expect(data.size).to eq(2)
        expect(data[0][:y]).to eq("AMAZONIA")
        expect(data[1][:y]).to eq("OTHER")
        expect(data[0][:x0]).to eq(100)
      end
    end

    context "when filtered by 1 exporter" do
      let(:parameters_hash) {
        shared_parameters_hash.merge(companies_ids: [api_v3_exporter1_node.id])
      }
      it "it summarized flows matching exporter per biome" do
        expect(data[0][:x0]).to eq(75)
      end
    end

    context "when filtered by 1 exporter and 1 destination excluded" do
      let(:parameters_hash) {
        shared_parameters_hash.merge(
          companies_ids: [api_v3_exporter1_node.id],
          excluded_destinations_ids: [
            api_v3_country_of_first_import_node_de.id
          ]
        )
      }
      it "it summarized flows matching exporter per biome" do
        expect(data[0][:x0]).to eq(55)
      end
    end

    context "when filtered by 2 exporters" do
      let(:parameters_hash) {
        shared_parameters_hash.merge(
          companies_ids: [
            api_v3_exporter1_node.id, api_v3_exporter2_node.id
          ]
        )
      }
      it "summarized flows matching either exporter per biome" do
        expect(data[0][:x0]).to eq(100)
      end
    end

    context "when filtered by 1 exporter and 1 importer" do
      let(:parameters_hash) {
        shared_parameters_hash.merge(
          companies_ids: [
            api_v3_exporter2_node.id, api_v3_importer1_node.id
          ]
        )
      }
      it "summarized flows matching exporter AND importer per biome" do
        expect(data[0][:x0]).to eq(25)
      end
    end

    context "when filtered by 2 exporters and 2 importers" do
      let(:parameters_hash) {
        shared_parameters_hash.merge(
          companies_ids: [
            api_v3_exporter1_node.id,
            api_v3_exporter2_node.id,
            api_v3_importer1_node.id,
            api_v3_importer2_node.id
          ]
        )
      }
      it "summarized flows matching either exporter AND either importer per biome" do
        expect(data[0][:x0]).to eq(100)
      end
    end
  end
end
