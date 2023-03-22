require "rails_helper"

RSpec.describe "Get contexts", type: :request do
  include_context "api v3 brazil soy nodes"
  include_context "api v3 brazil download attributes"
  include_context "api v3 brazil resize by attributes"
  include_context "api v3 brazil recolor by attributes"

  before(:each) do
    Api::V3::Readonly::FlowQualDistinctValues.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::Attribute.refresh(sync: true)
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
  end

  describe "GET /api/v3/contexts" do
    it "has the correct response structure" do
      get "/api/v3/contexts"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema("v3_contexts")
    end
  end
end
