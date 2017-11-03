require 'rails_helper'

RSpec.describe 'Get all nodes', type: :request do
  include_context 'brazil soy indicators'
  include_context 'brazil context nodes'

  include_context 'api v3 brazil soy indicators'
  include_context 'api v3 brazil context nodes'

  describe 'GET /api/v2/get_all_nodes === GET /api/v3/get_all_nodes ' do
    it 'has the correct response structure' do
      get '/api/v2/get_all_nodes', params: {:context_id => context.id}
      v2_response = JSON.parse @response.body
      expect(@response.status).to eq 200

      get '/api/v3/get_all_nodes', params: {:context_id => api_v3_context.id}
      expect(@response.status).to eq 200

      expect(JSON.parse(@response)).to eq v2_response
    end
  end
end
