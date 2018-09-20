require 'rails_helper'

RSpec.describe 'sources', type: :request do
  include_context 'api v3 brazil flows quants'

  describe 'GET /api/v3/dashboards/sources' do
    before(:each) do
      Api::V3::Readonly::Dashboards::Source.refresh(concurrently: false)
    end

    it 'requires countries_ids' do
      get '/api/v3/dashboards/sources'

      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq(
        'error' => 'param is missing or the value is empty: Required param countries_ids missing'
      )
    end

    it 'has the correct response structure' do
      get "/api/v3/dashboards/sources?countries_ids=#{api_v3_brazil.id}"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_sources')
    end
  end
end
