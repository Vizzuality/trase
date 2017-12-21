require 'rails_helper'

RSpec.describe 'Get columns', type: :request do
  include_context 'brazil contexts'

  describe 'GET /api/v2/get_columns === GET /api/v3/contexts/:id/columns ' do
    it 'has the correct response structure' do
      schema_revamp = SchemaRevamp.new
      schema_revamp.copy

      get "/api/v2/get_columns?context_id=#{context.id}"
      v2_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(@response.status).to eq 200

      get "/api/v3/contexts/#{context.id}/columns"
      expect(@response.status).to eq 200
      v3_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(v3_response).to eq v2_response

      schema_revamp.clean
    end
  end
end
