require 'rails_helper'

RSpec.describe 'Get indicators', type: :request do
  include_context 'brazil soy indicators'

  describe 'GET /api/v2/indicators === GET /api/v3/contexts/:id/download_attributes' do
    it 'has the correct response structure' do
      SchemaRevamp.new.copy

      get "/api/v2/indicators?context_id=#{context.id}"
      v2_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(@response.status).to eq 200

      get "/api/v3/contexts/#{context.id}/download_attributes"
      expect(@response.status).to eq 200
      v3_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(v3_response).to eq v2_response
    end
  end
end
