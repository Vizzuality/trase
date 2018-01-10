require 'rails_helper'

RSpec.describe 'Get download', type: :request do
  include_context 'brazil context nodes'
  include_context 'brazil flows quants'
  include_context 'brazil soy indicators'

  describe 'GET /api/v2/download.csv === GET /api/v3/contexts/:id/download.csv' do
    it 'has the correct response structure' do
      MaterializedFlow.refresh
      SchemaRevamp.new.copy
      get "/api/v2/download.csv?context_id=#{context.id}"
      v2_response = Zipfile.extract_data_file(@response.body, 'csv')

      expect(@response.status).to eq 200

      get "/api/v3/contexts/#{context.id}/download.csv"
      expect(@response.status).to eq 200
      v3_response = Zipfile.extract_data_file(@response.body, 'csv')

      expect(v3_response).to eq v2_response
    end
  end

  describe 'GET /api/v2/download.json === GET /api/v3/contexts/:id/download.json' do
    it 'has the correct response structure' do
      MaterializedFlow.refresh
      SchemaRevamp.new.copy
      get "/api/v2/download.json?context_id=#{context.id}"
      v2_response_unzipped = Zipfile.extract_data_file(@response.body, 'json')
      v2_response = HashSorter.new({}).sort_array(JSON.parse(v2_response_unzipped))

      expect(@response.status).to eq 200

      get "/api/v3/contexts/#{context.id}/download.json"
      expect(@response.status).to eq 200
      v3_response_unzipped = Zipfile.extract_data_file(@response.body, 'json')
      v3_response = HashSorter.new({}).sort_array(JSON.parse(v3_response_unzipped))

      expect(v3_response).to eq v2_response
    end
  end
end
