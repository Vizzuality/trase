require 'rails_helper'

RSpec.describe 'destinations', type: :request do
  include_context 'api v3 brazil flows quants'

  describe 'GET /api/v3/dashboards/destinations' do
    before(:each) do
      Api::V3::Readonly::Dashboards::Destination.refresh(concurrently: false)
    end

    it 'has the correct response structure' do
      get '/api/v3/dashboards/destinations'

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_destinations')
    end
  end
end
