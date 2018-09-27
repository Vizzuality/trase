require 'rails_helper'

RSpec.describe Api::V3::Dashboards::SourcesController, type: :controller do
  include_context 'api v3 brazil flows quants'

  describe 'GET search' do
    before(:each) do
      Api::V3::Readonly::Dashboards::Source.refresh
    end
    it 'returns matching sources' do
      get :search, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        q: 'ubi'
      }
      expect(assigns(:collection).map(&:id)).to eq([api_v3_municipality_node.id])
    end
  end
end
