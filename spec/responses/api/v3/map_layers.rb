require 'rails_helper'

RSpec.describe 'Get map base data', type: :request do
  include_context 'api v3 brazil soy indicators'
  include_context 'api v3 brazil context layers'

  describe 'GET /api/v3/contexts/:context_id:/map_layers' do
    before(:each) do
      SchemaRevamp.new.refresh
    end

    it 'requires a context_id' do
      get "/api/v3/contexts/#{api_v3_context.id - 100}/map_layers"

      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq('error' => 'param is missing or the value is empty: Required context_id missing')
    end

    it 'returns 404 on non-existent context_id' do
      expect { get "/api/v3/contexts/#{api_v3_context.id}/map_layers" }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/map_layers"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('v3_map_layers')
    end
  end
end
