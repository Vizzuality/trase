require 'rails_helper'

RSpec.describe 'Get indicators', type: :request do
  include_context 'brazil soy indicators'

  describe 'GET /indicators' do
    it 'requires a context_id' do
      get '/indicators'

      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq('error' => 'param is missing or the value is empty: Required context_id missing')
    end

    it 'returns 404 on non-existent context_id' do
      expect { get '/indicators', params: {context_id: context.id - 100} }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'has the correct response structure' do
      get '/indicators', params: {context_id: context.id}

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('indicators')
    end
  end
end
