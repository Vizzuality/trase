require "rails_helper"

RSpec.describe "Flows", type: :request do
  include_context "api v3 brazil soy flow quants"

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true)
    stub_request(:post, "https://www.google-analytics.com/collect").
      to_return(status: 200, body: "", headers: {})
  end

  describe "GET /api/public/flows" do
    it "has the correct response structure" do
      country = Api::V3::Country.first.iso2
      commodity = Api::V3::Commodity.first.name
      get "/api/public/flows?country=#{country}&commodity=#{commodity}"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("public_flows")
    end
  end
end
