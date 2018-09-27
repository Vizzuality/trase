require 'rails_helper'

RSpec.describe Api::V3::Dashboards::CompaniesController, type: :controller do
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::Dashboards::Company.refresh
  end

  describe 'GET search' do
    it 'returns companies by name' do
      get :search, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        q: 'afg'
      }
      expect(assigns(:collection).map(&:id)).to eq([api_v3_exporter1_node.id])
    end
  end

  describe 'GET index' do
    it 'returns companies by id' do
      get :index, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        companies_ids: api_v3_exporter1_node.id
      }
      expect(assigns(:collection).map(&:id)).to eq([api_v3_exporter1_node.id])
    end
  end
end
