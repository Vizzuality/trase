require "rails_helper"

RSpec.describe "Commodities", type: :request do
  include_context "api v3 brazil soy flow quants"

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(
      sync: true, skip_dependents: true
    )
    Api::V3::Readonly::Dashboards::Commodity.refresh(sync: true)
  end

  describe "GET /api/v3/dashboards/commodities" do
    it "has the correct response structure" do
      get "/api/v3/dashboards/commodities"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("dashboards_commodities")
    end
  end

  describe "GET /api/v3/dashboards/commodities/search" do
    it "has the correct response structure" do
      get "/api/v3/dashboards/commodities/search?q=b"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("dashboards_commodities_search")
    end
  end
end
