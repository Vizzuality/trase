require "rails_helper"

RSpec.describe "Nodes attributes", type: :request do
  include_context "api v3 brazil context node types"
  include_context "api v3 brazil map attributes"
  include_context "api v3 brazil municipality quant values"
  include_context "api v3 brazil municipality ind values"

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  describe "GET /api/v3/contexts/:context_id/nodes/attributes" do
    it "requires a start_year" do
      get "/api/v3/contexts/#{api_v3_brazil_soy_context.id}/nodes/attributes"

      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq("error" => "param is missing or the value is empty: Required param start_year missing")
    end

    it "requires a end_year" do
      get "/api/v3/contexts/#{api_v3_brazil_soy_context.id}/nodes/attributes", params: {start_year: 2015}

      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq("error" => "param is missing or the value is empty: Required param end_year missing")
    end

    it "has the correct response structure" do
      get "/api/v3/contexts/#{api_v3_brazil_soy_context.id}/nodes/attributes", params: {start_year: 2015, end_year: 2015, layer_ids: [api_v3_water_scarcity_map_attribute.id]}

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("v3_node_attributes")
      expect(JSON.parse(@response.body)["data"].empty?).to be false
    end
  end
end
