require 'rails_helper'

RSpec.describe 'Profile metadata', type: :request do
  include_context 'api v3 brazil flows quants'
  include_context 'api v3 brazil soy profiles'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh
  end

  describe 'GET /api/v3/contexts/:context_id/nodes/:node_id/profile_metadata' do
    it 'has the correct response structure for countries' do
      get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_municipality_node.id}/profile_metadata"
      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('v3_profile_metadata')
    end
  end
end
