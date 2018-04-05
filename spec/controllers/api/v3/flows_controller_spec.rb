require 'rails_helper'

RSpec.describe Api::V3::FlowsController, type: :controller do
  include_context 'api v3 brazil flows quants'

  describe 'GET index' do
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
        end_year: 2015,
        include_columns: node_types.map(&:id),
        flow_quant: api_v3_volume.name,
        limit: 1
      }
    }
    context 'when context without node types' do
      let(:context) { FactoryBot.create(:api_v3_context) }

      it 'returns 400' do
        get :index, params: {
          context_id: context.id
        }.merge(filter_params)
        expect(response).to have_http_status(400)
      end
    end
  end
end
