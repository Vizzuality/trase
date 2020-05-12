require 'rails_helper'

RSpec.describe 'Templates', type: :request do
  include_context 'api v3 brazil soy flow quants'

  describe 'GET /api/v3/dashboards/templates' do
    before(:each) do
      Api::V3::Readonly::FlowNode.refresh(
        sync: true, skip_dependents: true
      )
      Api::V3::Readonly::Dashboards::Commodity.refresh(sync: true)
      Api::V3::Readonly::Dashboards::Country.refresh(sync: true)
      Api::V3::Readonly::NodesPerContextRankedByVolumePerYear.refresh(
        sync: true, skip_dependents: true
      )
      Api::V3::Readonly::Dashboards::Source.refresh(sync: true)
      Api::V3::Readonly::Dashboards::Company.refresh(sync: true)
      Api::V3::Readonly::Dashboards::Destination.refresh(sync: true)
    end

    it 'has the correct response structure' do
      get '/api/v3/dashboards/templates'

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('dashboards_templates')
    end
  end
end
