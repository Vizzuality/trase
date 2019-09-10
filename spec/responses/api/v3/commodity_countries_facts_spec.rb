require 'rails_helper'

RSpec.describe 'Get commodity countries facts', type: :request do
  include_context 'api v3 brazil flows quants'
  include_context 'api v3 paraguay flows quants'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::FlowQuantTotal.refresh(sync: true, skip_dependents: true)
  end

  describe 'GET /api/v3/commodities/:id/countries_facts' do
    it 'has the correct response structure' do
      get "/api/v3/commodities/#{api_v3_soy.id}/countries_facts"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('commodity_countries_facts')
    end
  end
end