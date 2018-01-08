require 'rails_helper'

RSpec.describe 'Map Groups', type: :request do
  include_context 'brazil contexts'
  include_context 'brazil soy indicators'
  include_context 'brazil context layers'

  describe 'GET /api/v2/get_map_base_data === GET /api/v3/context/:id/map_groups ' do
    it 'has the correct response structure' do
      schema_revamp = SchemaRevamp.new
      schema_revamp.copy

      get "/api/v2/get_map_base_data?context_id=#{context.id}"
      v2_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(@response.status).to eq 200

      get "/api/v3/contexts/#{context.id}/map_groups"
      expect(@response.status).to eq 200
      v3_response = HashSorter.new(JSON.parse(@response.body)).sort

      # Removing the key "dimensions" as the v2 is not calculating it properly
      expect(v2_response).to have_key('dimensions')
      expect(v3_response).to have_key('dimensions')

      v2_response['dimensions'].each { |x| x.except!('aggregateMethod') }
      v3_response['dimensions'].each { |x| x.except!('aggregateMethod') }

      expect(v3_response).to eq v2_response

      schema_revamp.clean
    end
  end
end
