require 'rails_helper'

RSpec.describe 'Flows', type: :request do
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true)
  end

  describe 'GET /api/public/flows' do
    it 'has the correct response structure' do
      get '/api/public/flows'

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('public_flows')
    end
  end
end
