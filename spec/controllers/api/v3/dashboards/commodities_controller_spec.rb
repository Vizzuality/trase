require 'rails_helper'

RSpec.describe Api::V3::Dashboards::CommoditiesController, type: :controller do
  include_context 'api v3 brazil flows quants'
  include_context 'api v3 brazil beef flows'
  include_context 'api v3 brazil soy profiles'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(
      sync: true, skip_dependencies: true, skip_dependents: true
    )
    Api::V3::Readonly::Dashboards::Commodity.refresh(sync: true, skip_dependencies: true)
  end

  describe 'GET search' do
    it 'returns commodities by name' do
      get :search, params: {q: 'so'}
      expect(assigns(:collection).map(&:name)).to eq([api_v3_soy.name])
    end
  end

  describe 'GET index' do
    it 'returns list in alphabetical order' do
      get :index, params: {countries_ids: api_v3_brazil.id}
      expect(assigns(:collection).map(&:name)).to eq(
        [api_v3_beef.name, api_v3_soy.name]
      )
    end

    it 'returns commodities by id' do
      get :index, params: {commodities_ids: api_v3_soy.id.to_s}
      expect(assigns(:collection).map(&:id)).to eq([api_v3_soy.id])
    end

    context 'when profile_only' do
      it 'returns commodities where nodes have profiles' do
        get :index, params: {profile_only: true}
        expect(assigns(:collection).map(&:id)).to eq([api_v3_soy.id])
      end
    end
  end
end
