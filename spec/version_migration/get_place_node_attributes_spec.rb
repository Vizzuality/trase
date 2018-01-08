require 'rails_helper'

RSpec.describe 'Get place node attributes', type: :request do
  include_context 'brazil municipality ind values'
  include_context 'brazil municipality quant values'
  include_context 'brazil municipality qual values'
  include_context 'brazil flows quants'

  describe 'GET /api/v2/get_place_node_attributes === GET /api/v3/contexts/:context_id/nodes/:id/place' do
    it 'has the correct response structure' do
      schema_revamp = SchemaRevamp.new
      schema_revamp.copy

      get "/api/v2/get_place_node_attributes?context_id=#{context.id}&year=2015&node_id=#{municipality_node.id}"
      v2_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(@response.status).to eq 200

      get "/api/v3/contexts/#{context.id}/nodes/#{municipality_node.id}/place?year=2015"
      expect(@response.status).to eq 200
      v3_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(v3_response).to eq v2_response

      schema_revamp.clean
    end
  end
end
