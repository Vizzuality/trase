require 'rails_helper'

RSpec.describe 'Importers', type: :request do
  include_context 'api v3 brazil soy flow quants'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(
      sync: true, skip_dependents: true
    )
    Api::V3::Readonly::NodesPerContextRankedByVolumePerYear.refresh(
      sync: true, skip_dependents: true
    )
    Api::V3::Readonly::Dashboards::Importer.refresh(sync: true)
  end

  describe 'GET /api/v3/dashboards/importers' do
    it 'has the correct response structure' do
      get '/api/v3/dashboards/importers'

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_companies')
    end
  end

  describe 'GET /api/v3/dashboards/importers/search' do
    it 'has the correct response structure' do
      get '/api/v3/dashboards/importers/search?q=a'

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_companies_search')
    end
  end
end
