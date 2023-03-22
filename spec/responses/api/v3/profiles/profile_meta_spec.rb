require "rails_helper"

RSpec.describe "Profile meta", type: :request do
  include_context "api v3 brazil soy flow quants"
  include_context "api v3 brazil soy profiles"

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh
  end

  describe "GET /api/v3/profiles/:node_id/profile_meta?context_id=:context_id" do
    it "has the correct response structure" do
      get "/api/v3/profiles/#{api_v3_municipality_node.id}/profile_meta?context_id=#{api_v3_brazil_soy_context.id}"
      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("v3_profile_meta")
    end
  end
end
