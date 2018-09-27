require 'rails_helper'

RSpec.describe Api::V3::Dashboards::CountriesController, type: :controller do
  include_context 'api v3 brazil flows quants'

  describe 'GET search' do
    before(:each) do
      Api::V3::Readonly::Dashboards::Country.refresh
    end
    it 'returns matching countries' do
      get :search, params: {
        q: 'bra'
      }
      expect(assigns(:collection).map(&:id)).to eq([api_v3_brazil.id])
    end
  end
end
