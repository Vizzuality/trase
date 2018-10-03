require 'rails_helper'

RSpec.describe 'Companies', type: :request do
  include_context 'api v3 brazil flows quants'

  describe 'GET /api/v3/dashboards/companies' do
    before(:each) do
      Api::V3::Readonly::Dashboards::Company.refresh(concurrently: false)
    end

    it 'has the correct response structure' do
      get '/api/v3/dashboards/companies'

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_companies')
    end
  end
end
