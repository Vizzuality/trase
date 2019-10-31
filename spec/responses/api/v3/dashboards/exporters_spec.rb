require 'rails_helper'

RSpec.describe 'Exporters', type: :request do
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(
      sync: true, skip_dependencies: true, skip_dependents: true
    )
    Api::V3::Readonly::NodesPerContextRankedByVolumePerYear.refresh(
      sync: true, skip_dependencies: true, skip_dependents: true
    )
    Api::V3::Readonly::Dashboards::Exporter.refresh(sync: true, skip_dependencies: true)
  end

  describe 'GET /api/v3/dashboards/exporters' do
    it 'has the correct response structure' do
      get '/api/v3/dashboards/exporters'

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_companies')
    end
  end

  describe 'GET /api/v3/dashboards/exporters/search' do
    it 'has the correct response structure' do
      get '/api/v3/dashboards/exporters/search?q=a'

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_companies_search')
    end
  end
end
