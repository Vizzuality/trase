require "rails_helper"

RSpec.describe "Node types", type: :request do
  include_context "api v3 brazil context node types"
  include_context "api v3 paraguay context node types"

  before(:each) do
    stub_request(:post, "https://www.google-analytics.com/collect").
      to_return(status: 200, body: "", headers: {})
  end

  describe "GET /api/public/node_types" do
    it "has the correct response structure" do
      get "/api/public/node_types"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("public_node_types")
    end
  end
end
