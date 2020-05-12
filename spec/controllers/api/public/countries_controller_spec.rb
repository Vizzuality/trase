require 'rails_helper'

RSpec.describe Api::Public::CountriesController, type: :controller do
  include_context 'api v3 brazil soy flow quants'
  include_context 'api v3 paraguay flows quants'

  describe 'GET index' do
    it 'returns list in alphabetical order' do
      get :index, params: {commodities_ids: api_v3_soy.id}
      expect(assigns(:collection)[:data].map(&:name)).to eq(
        [api_v3_brazil.name, api_v3_paraguay.name]
      )
    end

    it 'returns countries by commodity ids' do
      get :index, params: {commodities_ids: api_v3_soy.id}
      expect(assigns(:collection)[:data].map(&:id)).to eq(
        [api_v3_brazil.id, api_v3_paraguay.id]
      )
    end

    context 'when include commodities' do
      it 'return list in alphabetical order with countries information' do
        get :index, params: {
          commodities_ids: api_v3_soy.id,
          include: 'commodities'
        }

        expect(assigns(:collection)[:meta][:commodities].first).to eq(
          Api::Public::CommoditySerializer.new(api_v3_soy).as_json
        )
      end
    end
  end
end
