require 'rails_helper'

RSpec.describe Api::V3::TopProfilesController, type: :request do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil exporter actor profile'

  let(:context_1) { api_v3_context }
  let(:node_1) { api_v3_exporter1_node }

  describe 'GET index' do
    before(:each) do
      Api::V3::Readonly::FlowNode.refresh(sync: true)
      Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
      Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::ChartAttribute.refresh(sync: true, skip_dependencies: true)
    end

    let!(:top_profile) { FactoryBot.create(:api_v3_top_profile, context: context_1, node: node_1) }

    it 'returns all the top profiles if context id not provided' do
      get '/api/v3/top_profiles'

      expect(response).to have_http_status(:ok)
      expect(response.body).to include(top_profile.context_id.to_s)
    end

    it 'returns top profiles for this context id' do
      get "/api/v3/top_profiles?context_id=#{top_profile.context_id}"

      expect(response).to have_http_status(:ok)
      expect(response.body).to include(top_profile.context_id.to_s)
    end
  end
end
