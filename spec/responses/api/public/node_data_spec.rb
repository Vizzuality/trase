require "rails_helper"

RSpec.describe "Node data", type: :request do
  include_context "api v3 quants"
  include_context "api v3 brazil soy flow quants"

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    stub_request(:post, "https://www.google-analytics.com/collect").
      to_return(status: 200, body: "", headers: {})
  end

  describe "GET /api/public/nodes/:id/data" do
    it "has the correct response structure" do
      get "/api/public/nodes/#{api_v3_biome_node.id}/data?year=2015"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("public_node_data")
    end
  end
end
