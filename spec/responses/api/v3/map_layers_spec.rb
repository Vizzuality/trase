require 'rails_helper'

RSpec.describe 'Map layers', type: :request do
  include_context 'api v3 brazil contextual layers'
  include_context 'api v3 brazil map attributes'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::MapAttribute.refresh(sync: true, skip_dependencies: true)
    Api::V3::Readonly::ContextAttributeProperty.refresh(sync: true, skip_dependencies: true)
    Api::V3::Readonly::CountryAttributeProperty.refresh(sync: true, skip_dependencies: true)
    Api::V3::Readonly::CommodityAttributeProperty.refresh(sync: true, skip_dependencies: true)
  end

  describe 'GET /api/v3/contexts/:context_id/map_layers' do
    it 'requires start_year' do
      get "/api/v3/contexts/#{api_v3_context.id}/map_layers"

      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq(
        'error' => 'param is missing or the value is empty: Required param start_year missing'
      )
    end

    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/map_layers?start_year=2014"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('v3_map_layers')
    end
  end

  describe 'GET /api/v3/map_layers_data' do
    it 'redirects to S3' do
      s3_url = 'TODO'
      map_attributes_export = instance_double(Api::V3::MapAttributesExport)
      allow(Api::V3::MapAttributesExport).to receive(:new).and_return(map_attributes_export)
      allow(map_attributes_export).to receive(:public_url).and_return(s3_url)
      get '/api/v3/map_layers_data'
      expect(@response).to redirect_to(s3_url)
    end
  end
end
