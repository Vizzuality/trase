require 'rails_helper'

RSpec.describe 'Get node attributes', type: :request do
  include_context 'brazil context nodes'
  include_context 'brazil context layers'
  include_context 'brazil municipality quant values'
  include_context 'brazil municipality ind values'

  describe 'GET /api/v2/get_node_attributes' do
    it 'requires a context_id' do
      get '/api/v2/get_node_attributes'

      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq('error' => 'param is missing or the value is empty: Required context_id missing')
    end

    it 'returns 404 on non-existent context_id' do
      expect { get '/api/v2/get_node_attributes', params: {context_id: context.id - 100} }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'requires a start_year' do
      get '/api/v2/get_node_attributes', params: {context_id: context.id}

      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq('error' => 'param is missing or the value is empty: Required start_year missing')
    end

    it 'requires a end_year' do
      get '/api/v2/get_node_attributes', params: {context_id: context.id, start_year: 2015}

      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq('error' => 'param is missing or the value is empty: Required end_year missing')
    end

    it 'has the correct response structure' do
      get '/api/v2/get_node_attributes', params: {context_id: context.id, start_year: 2015, end_year: 2015}

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('node_attributes')
    end
  end
end
