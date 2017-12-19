require 'rails_helper'

RSpec.describe 'Get nodes attributes', type: :request do
  include_context 'brazil municipality quant values'
  include_context 'brazil municipality ind values'

  describe 'GET /api/v2/get_nodes_attributes === GET /api/v3/contexts/:id/nodes/attributes ' do
    it 'has the correct response structure' do
      schema_revamp = SchemaRevamp.new
      schema_revamp.copy

      get "/api/v2/get_node_attributes?context_id=#{context.id}&start_year=2015&end_year=2015"
      v2_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(@response.status).to eq 200

      get "/api/v3/contexts/#{context.id}/nodes/attributes?start_year=2015&end_year=2015"
      expect(@response.status).to eq 200
      v3_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(v3_response).to eq v2_response

      schema_revamp.clean
    end
  end
end
