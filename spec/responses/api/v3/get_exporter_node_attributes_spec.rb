require 'rails_helper'

RSpec.describe 'Get exporter node attributes', type: :request do
  include_context 'api v3 brazil exporter quant values'
  include_context 'api v3 brazil exporter qual values'
  include_context 'api v3 brazil exporter ind values'
  include_context 'api v3 brazil municipality quant values'
  include_context 'api v3 brazil municipality qual values'
  include_context 'api v3 brazil municipality ind values'
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil flows quants'

  describe 'GET /api/v3/contexts/:context_id/nodes/:node_id/actor' do
    it 'validates node types' do
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_country_of_destination1_node.id}/actor" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_port1_node.id}/actor" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_municipality_node.id}/actor" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_logistics_hub_node.id}/actor" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_biome_node.id}/actor" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_state_node.id}/actor" }.to raise_error(ActiveRecord::RecordNotFound)

      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_exporter1_node.id}/actor" }.to_not raise_error
    end

    it 'returns 404 on non-existent context_id' do
      expect { get "/api/v3/contexts/#{api_v3_context.id - 100}/nodes/#{api_v3_exporter1_node.id}/actor" }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_exporter1_node.id}/actor"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('exporter_profile')
    end
  end
end
