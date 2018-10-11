require 'rails_helper'

RSpec.describe Api::V3::Dashboards::CommoditiesController, type: :controller do
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::Dashboards::FlowPath.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::Dashboards::Commodity.refresh(sync: true, skip_dependencies: true)
  end

  describe 'GET search' do
    it 'returns commodities by name' do
      get :search, params: {q: 'so'}
      expect(assigns(:collection).map(&:id)).to eq([api_v3_soy.id])
    end
  end

  describe 'GET index' do
    it 'returns commodities by id' do
      get :index, params: {commodities_ids: api_v3_soy.id.to_s}
      expect(assigns(:collection).map(&:id)).to eq([api_v3_soy.id])
    end
  end
end
