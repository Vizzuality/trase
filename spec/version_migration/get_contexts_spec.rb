require 'rails_helper'

RSpec.describe 'Get contexts', type: :request do
  include_context 'brazil soy indicators'
  include_context 'brazil resize by'
  include_context 'brazil recolor by'

  describe 'GET /api/v2/get_contexts === GET /api/v3/get_contexts ' do
    it 'has the correct response structure' do
      get '/api/v2/get_contexts'
      v2_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(@response.status).to eq 200

      get '/api/v3/get_contexts'
      expect(@response.status).to eq 200
      v3_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(v3_response).to eq v2_response
    end
  end
end
