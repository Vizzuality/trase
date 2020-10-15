require 'rails_helper'

RSpec.describe Api::Public::CommoditiesController, type: :controller do
  include_context 'api v3 brazil soy flow quants'
  include_context 'api v3 brazil beef flows'

  describe 'GET index' do
    it 'returns list in alphabetical order' do
      get :index, params: {countries_ids: api_v3_brazil.id}
      expect(assigns(:collection)[:data].map(&:name)).to match_array(
        [api_v3_beef.name, api_v3_soy.name]
      )
    end

    context 'when include countries' do
      it 'return list in alphabetical order with countries information' do
        get :index, params: {countries_ids: api_v3_brazil.id, include: 'countries'}

        expect(assigns(:collection)[:meta][:countries].first).to eq(
          Api::Public::CountrySerializer.new(api_v3_brazil).as_json
        )
      end
    end
  end
end
