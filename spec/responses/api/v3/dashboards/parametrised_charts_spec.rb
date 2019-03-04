require 'rails_helper'

RSpec.describe 'ParametrisedCharts', type: :request do
  include_context 'api v3 brazil context node types'
  include_context 'api v3 brazil recolor by attributes'
  include_context 'api v3 brazil resize by attributes'

  describe 'GET /api/v3/dashboards/parametrised_charts' do
    before(:each) do
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::ResizeByAttribute.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::RecolorByAttribute.refresh(sync: true, skip_dependents: true)
    end

    it 'has the correct response structure' do
      get '/api/v3/dashboards/parametrised_charts', params: {
        country_id: api_v3_brazil.id,
        commodity_id: api_v3_soy.id,
        cont_attribute_id: api_v3_volume.readonly_attribute.id
      }

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_parametrised_charts')
    end
  end
end
