require 'rails_helper'

RSpec.describe 'Map layers', type: :request do
  include_context 'api v3 brazil contextual layers'
  include_context 'api v3 brazil map attributes'

  describe 'GET /api/v3/contexts/:context_id/map_layers' do
    before(:each) do
      SchemaRevamp.new.refresh
    end

    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/map_layers"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('v3_map_layers')
    end
  end
end
