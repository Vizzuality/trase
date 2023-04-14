require "rails_helper"

RSpec.describe "Countries", type: :request do
  include_context "api v3 brazil soy flow quants"

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(
      sync: true, skip_dependents: true
    )
    Api::V3::Readonly::Dashboards::Country.refresh(sync: true)
  end

  describe "GET /api/v3/dashboards/countries" do
    it "has the correct response structure" do
      get "/api/v3/dashboards/countries"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("dashboards_countries")
    end
  end

  describe "GET /api/v3/dashboards/countries/search" do
    it "has the correct response structure" do
      get "/api/v3/dashboards/countries/search?q=b"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("dashboards_countries_search")
    end
  end
end
