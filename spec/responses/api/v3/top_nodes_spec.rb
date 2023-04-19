require "rails_helper"

RSpec.describe "Top nodes", type: :request do
  include_context "api v3 brazil soy flow quants"

  describe "GET /api/v3/contexts/:context_id/top_nodes" do
    it "has the correct response structure for countries" do
      get "/api/v3/contexts/#{api_v3_brazil_soy_context.id}/top_nodes?year=2015&column_id=#{api_v3_country_of_first_import_node_type.id}"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("v3_top_nodes")
    end

    it "has the correct response structure for exporters" do
      get "/api/v3/contexts/#{api_v3_brazil_soy_context.id}/top_nodes?year=2015&column_id=#{api_v3_exporter_node_type.id}"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("v3_top_nodes")
    end
  end
end
