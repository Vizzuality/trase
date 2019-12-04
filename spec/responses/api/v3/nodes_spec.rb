require 'rails_helper'

RSpec.describe 'Nodes', type: :request do
  include_context 'api v3 brazil context node types'
  include_context 'api v3 brazil flows'

  describe 'GET /api/v3/contexts/:context_id/nodes' do
    before(:each) do
      Api::V3::Readonly::FlowNode.refresh(sync: true)
      Api::V3::Readonly::NodeWithFlowsOrGeo.refresh(sync: true)
    end

    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/nodes"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('all_nodes')
    end
  end
end
