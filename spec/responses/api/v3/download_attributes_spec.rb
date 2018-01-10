require 'rails_helper'

RSpec.describe 'Download Attributes', type: :request do
  include_context 'api v3 brazil download attributes'

  describe 'GET /api/v3/contexts/:context_id/download_attributes' do
    before(:each) do
      SchemaRevamp.new.refresh
    end

    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/download_attributes"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('indicators')
    end
  end
end
