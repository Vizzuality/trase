require 'rails_helper'

RSpec.describe Api::V3::Profiles::ProfileMetaController, type: :controller do
  include_context 'api v3 brazil soy flows'
  include_context 'api v3 brazil soy profiles'

  describe 'GET index' do
    before do
      Api::V3::Readonly::FlowNode.refresh(sync: true)
      Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
      Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
    end

    context 'when node does not support profile pages' do
      let(:node) { api_v3_logistics_hub_node }

      it 'is not found' do
        get :show, params: {context_id: api_v3_brazil_soy_context.id, id: node.id}
        expect(response).to have_http_status(404)
      end
    end

    context 'when node supports profile pages' do
      let(:node) { api_v3_municipality_node }

      it 'is successful' do
        get :show, params: {context_id: api_v3_brazil_soy_context.id, id: node.id}
        expect(response).to be_successful
      end
    end
  end
end
