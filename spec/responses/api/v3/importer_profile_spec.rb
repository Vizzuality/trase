require "rails_helper"

RSpec.describe "Importer profile", type: :request do
  include_context "api v3 brazil importer quant values"
  include_context "api v3 brazil importer qual values"
  include_context "api v3 brazil importer ind values"
  include_context "api v3 brazil municipality quant values"
  include_context "api v3 brazil municipality qual values"
  include_context "api v3 brazil municipality ind values"
  include_context "api v3 brazil soy flow quants"
  include_context "api v3 brazil importer actor profile"

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::NodeWithFlows.where(profile: :actor).each(&:refresh_actor_basic_attributes)
  end

  let(:summary_params) { {year: 2015} }

  describe "GET /api/v3/contexts/:context_id/actors/:id/basic_attributes" do
    it "has the correct response structure" do
      get "/api/v3/contexts/#{api_v3_brazil_soy_context.id}/actors/#{api_v3_importer1_node.id}/basic_attributes", params: summary_params

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema("v3_actor_basic_attributes")
    end
  end
end
