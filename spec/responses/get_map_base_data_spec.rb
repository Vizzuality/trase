require 'rails_helper'

RSpec.describe 'Get map base data', type: :request do
  include_context 'brazil soy indicators'
  include_context 'brazil context layers'

  describe 'GET /get_map_base_data' do
    it 'requires a context_id' do
      get '/get_map_base_data'

      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq('error' => 'param is missing or the value is empty: Required context_id missing')
    end

    it 'returns 404 on non-existent context_id' do
      expect { get '/get_map_base_data', params: {context_id: context.id - 100} }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'has the correct response structure' do
      get '/get_map_base_data', params: {context_id: context.id}

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('map_base_data')
    end
  end
end
