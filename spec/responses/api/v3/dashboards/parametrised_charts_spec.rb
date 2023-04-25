require "rails_helper"

RSpec.describe "ParametrisedCharts", type: :request do
  include_context "api v3 brazil context node types"
  include_context "api v3 brazil recolor by attributes"
  include_context "api v3 brazil resize by attributes"
  include_context "api v3 brazil soy flow quants"
  include_context "api v3 brazil soy flow inds"
  include_context "api v3 brazil municipality qual values"
  include_context "api v3 dashboards attributes"

  let!(:another_municipality) {
    municipality = FactoryBot.create(
      :api_v3_node, node_type: api_v3_municipality_node_type
    )
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_brazil_soy_context,
      path: [
        api_v3_biome_node,
        api_v3_state_node,
        municipality,
        api_v3_logistics_hub_node,
        api_v3_port1_node,
        api_v3_exporter1_node,
        api_v3_importer1_node,
        api_v3_country_of_first_import_node_ru
      ].map(&:id),
      year: 2015
    )
    FactoryBot.create(
      :api_v3_node_qual, node: municipality, qual: api_v3_zero_deforestation
    )
    municipality
  }

  describe "GET /api/v3/dashboards/parametrised_charts" do
    before(:each) do
      Api::V3::Readonly::FlowQualDistinctValues.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::QualValuesMeta.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::IndValuesMeta.refresh(sync: true, skip_dependents: true)
    end

    let(:filter_params) {
      {
        country_id: api_v3_brazil.id,
        commodity_id: api_v3_soy.id,
        cont_attribute_id: api_v3_volume.readonly_attribute.id
      }
    }

    it "requires country_id" do
      get "/api/v3/dashboards/parametrised_charts", params: filter_params.except(:country_id)
      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq(
        "error" => "param is missing or the value is empty: Required param country_id missing"
      )
    end

    it "requires commodity_id" do
      get "/api/v3/dashboards/parametrised_charts", params: filter_params.except(:commodity_id)
      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq(
        "error" => "param is missing or the value is empty: Required param commodity_id missing"
      )
    end

    it "requires cont_attribute_id" do
      get "/api/v3/dashboards/parametrised_charts", params: filter_params.except(:cont_attribute_id)
      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq(
        "error" => "param is missing or the value is empty: Required param cont_attribute_id missing"
      )
    end

    it "returns not found if context not found" do
      get "/api/v3/dashboards/parametrised_charts", params: filter_params.merge(commodity_id: -1)
      expect(@response).to have_http_status(:not_found)
      expect(JSON.parse(@response.body)).to eq(
        "error" => "Couldn't find Api::V3::Context"
      )
    end

    it "returns not found if resize by not found" do
      get "/api/v3/dashboards/parametrised_charts", params: filter_params.merge(cont_attribute_id: -1)
      expect(@response).to have_http_status(:not_found)
      expect(JSON.parse(@response.body)).to eq(
        "error" => "Couldn't find Api::V3::Readonly::ResizeByAttribute"
      )
    end

    it "returns not found if recolor by not found" do
      get "/api/v3/dashboards/parametrised_charts", params: filter_params.merge(ncont_attribute_id: -1)
      expect(@response).to have_http_status(:not_found)
      expect(JSON.parse(@response.body)).to eq(
        "error" => "Couldn't find Api::V3::Readonly::RecolorByAttribute"
      )
    end

    it "has the correct response structure" do
      get "/api/v3/dashboards/parametrised_charts", params: {
        country_id: api_v3_brazil.id,
        commodity_id: api_v3_soy.id,
        cont_attribute_id: api_v3_volume.readonly_attribute.id,
        ncont_attribute_id: api_v3_forest_500.readonly_attribute.id,
        sources_ids: [api_v3_municipality_node.id, another_municipality.id].join(","),
        companies_ids: api_v3_exporter1_node.id,
        destinations_ids: nil,
        start_year: 2015,
        end_year: 2016
      }

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("dashboards_parametrised_charts")
    end
  end
end
