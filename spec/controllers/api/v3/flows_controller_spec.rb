require "rails_helper"

RSpec.describe Api::V3::FlowsController, type: :controller do
  include_context "api v3 brazil resize by attributes"
  include_context "api v3 brazil recolor by attributes"
  include_context "api v3 brazil soy flow quants"
  include_context "api v3 brazil soy flow quals"
  include_context "api v3 brazil soy flow inds"

  before(:each) do
    Api::V3::Readonly::FlowQualDistinctValues.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::TablePartitions::CreatePartitionsForFlows.new.call
    Api::V3::TablePartitions::CreatePartitionsForFlowQuants.new.call
  end

  let(:cont_attribute) { api_v3_volume.readonly_attribute }
  let(:ncont_attribute_ind) { api_v3_forest_500.readonly_attribute }
  let(:ncont_attribute_qual) { api_v3_biome.readonly_attribute }

  describe "GET index" do
    let(:node_types) {
      [
        api_v3_municipality_node_type,
        api_v3_exporter_node_type,
        api_v3_importer_node_type,
        api_v3_country_node_type
      ]
    }
    let(:filter_params) {
      {
        start_year: 2015,
        end_year: 2015,
        cont_attribute_id: cont_attribute.id,
        include_columns: node_types.map(&:id),
        limit: 1,
      }
    }
    context "when context without node types" do
      let(:context) { FactoryBot.create(:api_v3_context) }

      it "returns 400" do
        get :index, params: {
          context_id: context.id
        }.merge(filter_params)
        expect(response).to have_http_status(400)
      end
    end

    context "when context with ncont_attribute_id" do
      context "when ncont_attribute_id is a qual" do
        it "returns filtered flows" do
          get :index, params: {
            context_id: api_v3_brazil_soy_context.id,
            ncont_attribute_id: ncont_attribute_qual.id,
          }.merge(filter_params)

          expect(response).to have_http_status(200)
          parsed_response = JSON.parse(response.body)
          parsed_response["data"].each do |flow|
            expect(flow).to include("qual")
          end
        end
      end

      context "when ncont_attribute_id is a ind" do
        it "returns filtered flows" do
          get :index, params: {
            context_id: api_v3_brazil_soy_context.id,
            ncont_attribute_id: ncont_attribute_ind.id,
          }.merge(filter_params)

          expect(response).to have_http_status(200)
          parsed_response = JSON.parse(response.body)
          parsed_response["data"].each do |flow|
            expect(flow).to include("ind")
          end
        end
      end
    end
  end
end
