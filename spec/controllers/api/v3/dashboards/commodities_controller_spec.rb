require 'rails_helper'

RSpec.describe Api::V3::Dashboards::CommoditiesController, type: :controller do
  include_context 'api v3 brazil flows quants'

  describe 'GET search' do
    before(:each) do
      Api::V3::Readonly::Dashboards::Commodity.refresh
    end
    it 'returns matching commodities' do
      get :search, params: {
        q: 'so'
      }
      expect(assigns(:collection).map(&:id)).to eq([api_v3_soy.id])
    end
  end
end
