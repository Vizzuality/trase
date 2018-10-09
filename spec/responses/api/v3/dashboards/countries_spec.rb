require 'rails_helper'

RSpec.describe 'Countries', type: :request do
  include_context 'api v3 brazil flows quants'

  describe 'GET /api/v3/dashboards/countries' do
    before(:each) do
      Api::V3::Readonly::Dashboards::Country.refresh
    end

    it 'has the correct response structure' do
      get '/api/v3/dashboards/countries'

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_countries')
    end
  end
end
