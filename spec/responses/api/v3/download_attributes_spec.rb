require 'rails_helper'

RSpec.describe 'Download Attributes', type: :request do
  include_context 'api v3 brazil download attributes'
  include_context 'api v3 brazil municipality qual values'
  include_context 'api v3 brazil municipality quant values'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  describe 'GET /api/v3/contexts/:context_id/download_attributes' do
    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_brazil_soy_context.id}/download_attributes"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('indicators')
    end
  end
end
