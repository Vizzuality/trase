require 'rails_helper'

RSpec.describe 'Map groups', type: :request do
  include_context 'api v3 brazil map attributes'

  describe 'GET /api/v3/contexts/:context_id/map_groups' do
    before(:each) do
      SchemaRevamp.new.refresh
    end

    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/map_groups"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('map_base_data')
    end
  end
end
