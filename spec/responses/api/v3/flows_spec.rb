require 'rails_helper'

RSpec.describe 'Flows', type: :request do
  include_context 'api v3 brazil resize by attributes'
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::ResizeByAttribute.refresh(sync: true, skip_dependents: true)
    Api::V3::TablePartitions::CreatePartitionsForFlows.new.call
    Api::V3::TablePartitions::CreatePartitionsForFlowQuants.new.call
  end

  let(:cont_attribute) { api_v3_volume.readonly_attribute }

  describe 'GET /api/v2/contexts/:context_id/flows' do
    let(:node_types) {
      [
        api_v3_municipality_node_type,
        api_v3_exporter_node_type,
        api_v3_importer_node_type,
        api_v3_country_node_type
      ]
    }
    let(:filter_params) {
      {
        start_year: 2015,
        include_columns: node_types.map(&:id),
        cont_attribute_id: cont_attribute.id
      }
    }
    it 'requires include_columns' do
      get "/api/v3/contexts/#{api_v3_context.id}/flows",
          params: filter_params.except(:include_columns)
      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq(
        'error' => 'param is missing or the value is empty: Required param include_columns missing'
      )
    end
    it 'requires flow_quant' do
      get "/api/v3/contexts/#{api_v3_context.id}/flows",
          params: filter_params.except(:cont_attribute_id)
      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq(
        'error' => 'param is missing or the value is empty: Required param cont_attribute_id missing'
      )
    end
    it 'requires start_year' do
      get "/api/v3/contexts/#{api_v3_context.id}/flows",
          params: filter_params.except(:start_year)
      expect(@response).to have_http_status(:bad_request)
      expect(JSON.parse(@response.body)).to eq(
        'error' => 'param is missing or the value is empty: Required param start_year missing'
      )
    end
    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/flows",
          params: filter_params
      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('flows')
    end
  end
end
