require 'rails_helper'

RSpec.describe 'Nodes importers', type: :request do
  include_context 'api v3 brazil soy flow quants'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
  end

  describe 'GET /api/public/nodes/importers' do
    it 'has the correct response structure' do
      get '/api/public/nodes/importers'

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('public_nodes')
    end
  end
end
