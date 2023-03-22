require "rails_helper"

RSpec.describe "Attributes", type: :request do
  include_context "api v3 brazil soy flow quants"

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true)
    Api::Public::Readonly::FlowAttribute.refresh(sync: true)
    stub_request(:post, "https://www.google-analytics.com/collect").
      to_return(status: 200, body: "", headers: {})
  end

  describe "GET /api/public/attributes" do
    it "has the correct response structure" do
      get "/api/public/attributes"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("public_attributes")
    end
  end
end
