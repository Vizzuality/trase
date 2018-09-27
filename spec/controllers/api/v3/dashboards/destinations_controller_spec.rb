require 'rails_helper'

RSpec.describe Api::V3::Dashboards::DestinationsController, type: :controller do
  include_context 'api v3 brazil flows quants'

  describe 'GET search' do
    before(:each) do
      Api::V3::Readonly::Dashboards::Destination.refresh
    end
    it 'returns matching destinations' do
      get :search, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        q: 'rus'
      }
      expect(assigns(:collection).map(&:id)).to eq([api_v3_country_of_destination1_node.id])
    end
  end
end
