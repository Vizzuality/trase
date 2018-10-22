require 'rails_helper'

RSpec.describe Api::V3::Dashboards::CountriesController, type: :controller do
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::Dashboards::FlowPath.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::Dashboards::Country.refresh(sync: true, skip_dependencies: true)
  end

  describe 'GET search' do
    it 'returns countries by name' do
      get :search, params: {q: 'bra'}
      expect(assigns(:collection).map(&:id)).to eq([api_v3_brazil.id])
    end
  end

  describe 'GET index' do
    it 'returns countries by id' do
      get :index, params: {countries_ids: api_v3_brazil.id}
      expect(assigns(:collection).map(&:id)).to eq([api_v3_brazil.id])
    end
  end
end
