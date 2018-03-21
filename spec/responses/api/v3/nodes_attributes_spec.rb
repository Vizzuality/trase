require 'rails_helper'

RSpec.describe 'Nodes attributes', type: :request do
  include_context 'api v3 brazil context node types'
  include_context 'api v3 brazil map attributes'
  include_context 'api v3 brazil municipality quant values'
  include_context 'api v3 brazil municipality ind values'

  describe 'GET /api/v3/contexts/:context_id/nodes/attributes' do
    it 'requires a start_year' do
      get "/api/v3/contexts/#{api_v3_context.id}/nodes/attributes"

      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq('error' => 'param is missing or the value is empty: Required param start_year missing')
    end

    it 'requires a end_year' do
      get "/api/v3/contexts/#{api_v3_context.id}/nodes/attributes", params: {start_year: 2015}

      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq('error' => 'param is missing or the value is empty: Required param end_year missing')
    end

    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/nodes/attributes", params: {start_year: 2015, end_year: 2015}

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('v3_node_attributes')
    end
  end
end
