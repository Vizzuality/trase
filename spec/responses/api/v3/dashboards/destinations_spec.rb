require 'rails_helper'

RSpec.describe 'destinations', type: :request do
  include_context 'api v3 brazil soy flow quants'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(
      sync: true, skip_dependents: true
    )
    Api::V3::Readonly::NodesPerContextRankedByVolumePerYear.refresh(
      sync: true, skip_dependents: true
    )
    Api::V3::Readonly::Dashboards::Destination.refresh(sync: true)
  end

  describe 'GET /api/v3/dashboards/destinations' do
    it 'has the correct response structure' do
      get '/api/v3/dashboards/destinations'

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_destinations')
    end
  end

  describe 'GET /api/v3/dashboards/destinations/search' do
    it 'has the correct response structure' do
      get '/api/v3/dashboards/destinations/search?q=a'

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_destinations_search')
    end
  end
end
