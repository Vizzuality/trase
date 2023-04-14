require "rails_helper"

RSpec.describe Api::V3::PlacesController, type: :controller do
  include_context "api v3 brazil soy flow quants"
  include_context "api v3 brazil municipality place profile"

  let(:node) { api_v3_municipality_node }
  let(:year) { 2015 }
  let(:valid_params) {
    {context_id: api_v3_brazil_soy_context.id, id: node.id, year: year}
  }
  let(:quant_dict) { instance_double(Dictionary::Quant) }
  let(:chart_config) {
    instance_double(Api::V3::Profiles::ChartConfiguration)
  }

  before(:each) do
    allow(Api::V3::AttributeNameAndTooltip).to(
      receive(:call).and_return(Api::V3::AttributeNameAndTooltip::NameAndTooltip.new("NAME", "TOOLTIP"))
    )
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  describe "GET basic_attributes" do
    context "when node without flows" do
      let(:node) {
        node = FactoryBot.create(
          :api_v3_node, node_type: api_v3_municipality_node_type
        )
        FactoryBot.create(:api_v3_node_property, node: node)
        node
      }

      it "is not found" do
        get :basic_attributes, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context "when node without place profile" do
      let(:node) { api_v3_exporter1_node }

      it "is not found" do
        get :basic_attributes, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context "when Volume quant missing" do
      it "is not found" do
        allow(Dictionary::Quant).to receive(:instance).and_return(quant_dict)
        allow(quant_dict).to receive(:get).and_return(nil)

        get :basic_attributes, params: valid_params
        expect(response).to have_http_status(404)
      end
    end

    context "when year provided and valid for node" do
      it "is successful" do
        get :basic_attributes, params: valid_params
        expect(response).to be_successful
      end
    end

    context "when year provided but not valid for node" do
      it "defaults to last available" do
        get :basic_attributes, params: valid_params.merge(year: 2016)
        expect(assigns(:year)).to eq(year)
        expect(response).to be_successful
      end
    end

    context "when year not provided" do
      it "defaults to last available" do
        get :basic_attributes, params: valid_params.except(:year)
        expect(assigns(:year)).to eq(year)
        expect(response).to be_successful
      end
    end
  end

  describe "GET top_consumer_actors" do
    context "when trader node type configuration missing" do
      it "is not found" do
        allow(Api::V3::Profiles::ChartConfiguration).to(
          receive(:new).and_return(chart_config)
        )
        allow(chart_config).to(
          receive(:named_node_type).with("trader").and_return(nil)
        )

        get :top_consumer_actors, params: valid_params
        expect(response).to have_http_status(404)
      end
    end
  end

  describe "GET top_consumer_countries" do
    context "when destination node type configuration missing" do
      it "is not found" do
        allow(Api::V3::Profiles::ChartConfiguration).to(
          receive(:new).and_return(chart_config)
        )
        allow(chart_config).to(
          receive(:named_node_type).with("destination").and_return(nil)
        )

        get :top_consumer_countries, params: valid_params
        expect(response).to have_http_status(404)
      end
    end
  end

  describe "GET indicators" do
    context "when node without place profile" do
      let(:node) { api_v3_exporter1_node }

      it "is not found" do
        get :indicators, params: valid_params
        expect(response).to have_http_status(404)
      end
    end
  end

  describe "GET trajectory_deforestation" do
    context "when node without place profile" do
      let(:node) { api_v3_exporter1_node }

      it "is not found" do
        get :trajectory_deforestation, params: valid_params
        expect(response).to have_http_status(404)
      end
    end
  end
end
