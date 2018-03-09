require 'rails_helper'

RSpec.describe 'Flows', type: :request do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil flows quants'

  describe 'GET /api/v2/contexts/:context_id/flows' do
    let(:node_types) {
      [
        api_v3_municipality_node_type,
        api_v3_exporter_node_type,
        api_v3_importer_node_type,
        api_v3_country_node_type
      ]
    }
    let(:filter_params) {
      {
        year_start: 2015,
        include_columns: node_types.map(&:id),
        flow_quant: api_v3_volume.name
      }
    }
    it 'requires include_columns' do
      get "/api/v3/contexts/#{api_v3_context.id}/flows",
          params: filter_params.except(:include_columns)
      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq(
        'error' => 'param is missing or the value is empty: Required param include_columns missing'
      )
    end
    it 'requires flow_quant' do
      get "/api/v3/contexts/#{api_v3_context.id}/flows",
          params: filter_params.except(:flow_quant)
      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq(
        'error' => 'param is missing or the value is empty: Required param flow_quant missing'
      )
    end
    it 'requires year_start' do
      get "/api/v3/contexts/#{api_v3_context.id}/flows",
          params: filter_params.except(:year_start)
      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq(
        'error' => 'param is missing or the value is empty: Required param year_start missing'
      )
    end
    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/flows",
          params: filter_params
      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('flows')
    end
  end
end
