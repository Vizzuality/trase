require 'rails_helper'

RSpec.describe 'Get linked geo ids', type: :request do
  # include_context 'brazil contexts'
  # include_context 'brazil soy nodes'
  include_context 'two flows'

  before { @valid_params = {context_id: context.id, node_id: exporter1_node.id, years: [2015], target_column_id: municipality_node_type.id} }

  describe 'GET /get_linked_geoids' do
    it 'requires a context_id' do
      get '/get_linked_geoids', params: @valid_params.reject { |key| key == :context_id }

      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq('error' => 'param is missing or the value is empty: Required context_id missing')
    end

    it 'requires node_id' do
      get '/get_linked_geoids', params: @valid_params.reject { |key| key == :node_id }

      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq('error' => 'param is missing or the value is empty: Required node_id missing')
    end

    it 'requires target_column_id' do
      get '/get_linked_geoids', params: @valid_params.reject { |key| key == :target_column_id }

      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq('error' => 'param is missing or the value is empty: Required target_column_id missing')
    end

    it 'requires years' do
      get '/get_linked_geoids', params: @valid_params.reject { |key| key == :years }

      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq('error' => 'param is missing or the value is empty: Required year missing')
    end

    it 'returns 404 on non-existent context_id' do
      expect { get '/get_linked_geoids', params: {context_id: context.id - 100} }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'has the correct response structure' do
      get '/get_linked_geoids', params: @valid_params

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('get_linked_geo_ids')
    end
  end
end
