require 'rails_helper'

RSpec.describe 'Get all_nodes', type: :request do
  include_context 'brazil context nodes'

  describe 'GET /api/v2/get_all_nodes === GET /api/v3/contexts/:id/nodes' do
    it 'has the correct response structure' do
      SchemaRevamp.new.copy

      get "/api/v2/get_all_nodes?context_id=#{context.id}"
      v2_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(@response.status).to eq 200

      get "/api/v3/contexts/#{context.id}/nodes"
      expect(@response.status).to eq 200
      v3_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(v3_response).to eq v2_response
    end
  end
end
