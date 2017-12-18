require 'rails_helper'

RSpec.describe 'Get actor node attributes', type: :request do
  include_context 'brazil exporter ind values'
  include_context 'brazil exporter quant values'
  include_context 'brazil exporter qual values'
  include_context 'brazil flows quants'

  describe 'GET /api/v2/get_actor_node_attributes === GET /api/v3/contexts/:context_id/nodes/:id/actor' do
    it 'has the correct response structure' do
      SchemaRevamp.new.copy

      get "/api/v2/get_actor_node_attributes?context_id=#{context.id}&year=2015&node_id=#{exporter1_node.id}"
      v2_response = HashSorter.new(JSON.parse(@response.body)).sort
      # v2_response = JSON.parse(@response.body).deep_sort!

      expect(@response.status).to eq 200

      get "/api/v3/contexts/#{context.id}/nodes/#{exporter1_node.id}/actor?year=2015"
      expect(@response.status).to eq 200
      v3_response = HashSorter.new(JSON.parse(@response.body)).sort
      # v3_response = JSON.parse(@response.body).deep_sort!

      expect(v3_response).to eq v2_response
    end
  end
end
