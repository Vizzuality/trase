require 'rails_helper'

RSpec.describe 'Place profile', type: :request do
  include_context 'api v3 brazil municipality ind values'
  include_context 'api v3 brazil municipality qual values'
  include_context 'api v3 brazil municipality quant values'
  include_context 'api v3 brazil flows quants'

  describe 'GET /api/v3/contexts/:context_id/nodes/:id/place' do
    it 'validates node types' do
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_country_of_destination1_node.id}/place" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_exporter1_node.id}/place" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_importer1_node.id}/place" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_port1_node.id}/place" }.to raise_error(ActiveRecord::RecordNotFound)

      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_municipality_node.id}/place" }.to_not raise_error
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_logistics_hub_node.id}/place" }.to_not raise_error
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_biome_node.id}/place" }.to_not raise_error
      expect { get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_state_node.id}/place" }.to_not raise_error
    end

    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/nodes/#{api_v3_municipality_node.id}/place"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('v3_place_profile')
    end
  end

  describe 'GET /api/v3/contexts/:context_id/places/:id/basic_attributes' do
    it 'validates node types' do
      expect { get "/api/v3/contexts/#{api_v3_context.id}/places/#{api_v3_country_of_destination1_node.id}/basic_attributes" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/places/#{api_v3_exporter1_node.id}/basic_attributes" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/places/#{api_v3_importer1_node.id}/basic_attributes" }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get "/api/v3/contexts/#{api_v3_context.id}/places/#{api_v3_port1_node.id}/basic_attributes" }.to raise_error(ActiveRecord::RecordNotFound)

      expect { get "/api/v3/contexts/#{api_v3_context.id}/places/#{api_v3_municipality_node.id}/basic_attributes" }.to_not raise_error
      expect { get "/api/v3/contexts/#{api_v3_context.id}/places/#{api_v3_logistics_hub_node.id}/basic_attributes" }.to_not raise_error
      expect { get "/api/v3/contexts/#{api_v3_context.id}/places/#{api_v3_biome_node.id}/basic_attributes" }.to_not raise_error
      expect { get "/api/v3/contexts/#{api_v3_context.id}/places/#{api_v3_state_node.id}/basic_attributes" }.to_not raise_error
    end

    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/places/#{api_v3_municipality_node.id}/basic_attributes"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('v3_place_basic_attributes')
    end
  end

  describe 'GET /api/v3/contexts/:context_id/places/:id/top_consumer_actors' do
    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/places/#{api_v3_municipality_node.id}/top_consumer_actors"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('v3_place_top_consumer_actors')
    end
  end

  describe 'GET /api/v3/contexts/:context_id/places/:id/top_consumer_countries' do
    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/places/#{api_v3_municipality_node.id}/top_consumer_countries"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('v3_place_top_consumer_countries')
    end
  end

  describe 'GET /api/v3/contexts/:context_id/places/:id/indicators' do
    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/places/#{api_v3_municipality_node.id}/indicators"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('v3_place_indicators')
    end
  end

  describe 'GET /api/v3/contexts/:context_id/places/:id/trajectory_deforestation' do
    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/places/#{api_v3_municipality_node.id}/trajectory_deforestation"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('v3_place_trajectory_deforestation')
    end
  end
end
