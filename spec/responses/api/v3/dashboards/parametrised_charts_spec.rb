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

    let(:filter_params) {
      {
        country_id: api_v3_brazil.id,
        commodity_id: api_v3_soy.id,
        cont_attribute_id: api_v3_volume.readonly_attribute.id
      }
    }

    it 'requires country_id' do
      get '/api/v3/dashboards/parametrised_charts', params: filter_params.except(:country_id)
      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq(
        'error' => 'param is missing or the value is empty: Required param country_id missing'
      )
    end

    it 'requires commodity_id' do
      get '/api/v3/dashboards/parametrised_charts', params: filter_params.except(:commodity_id)
      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq(
        'error' => 'param is missing or the value is empty: Required param commodity_id missing'
      )
    end

    it 'requires cont_attribute_id' do
      get '/api/v3/dashboards/parametrised_charts', params: filter_params.except(:cont_attribute_id)
      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq(
        'error' => 'param is missing or the value is empty: Required param cont_attribute_id missing'
      )
    end

    it 'returns not found if context not found' do
      get '/api/v3/dashboards/parametrised_charts', params: filter_params.merge(commodity_id: -1)
      expect(@response).to have_http_status(:not_found)
      expect(JSON.parse(@response.body)).to eq(
        'error' => "Couldn't find Api::V3::Context"
      )
    end

    it 'returns not found if resize by not found' do
      get '/api/v3/dashboards/parametrised_charts', params: filter_params.merge(cont_attribute_id: -1)
      expect(@response).to have_http_status(:not_found)
      expect(JSON.parse(@response.body)).to eq(
        'error' => "Couldn't find Api::V3::Readonly::ResizeByAttribute"
      )
    end

    it 'returns not found if recolor by not found' do
      get '/api/v3/dashboards/parametrised_charts', params: filter_params.merge(ncont_attribute_id: -1)
      expect(@response).to have_http_status(:not_found)
      expect(JSON.parse(@response.body)).to eq(
        'error' => "Couldn't find Api::V3::Readonly::RecolorByAttribute"
      )
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
