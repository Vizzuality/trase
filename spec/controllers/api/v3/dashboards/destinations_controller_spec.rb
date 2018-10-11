require 'rails_helper'

RSpec.describe Api::V3::Dashboards::DestinationsController, type: :controller do
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::Dashboards::FlowPath.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::Dashboards::Destination.refresh(sync: true, skip_dependencies: true)
  end

  describe 'GET search' do
    it 'returns destinations by name' do
      get :search, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        q: 'rus'
      }
      expect(assigns(:collection).map(&:id)).to eq([api_v3_country_of_destination1_node.id])
    end
  end

  describe 'GET index' do
    it 'returns destinations by id' do
      get :index, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        destinations_ids: api_v3_country_of_destination1_node.id
      }
      expect(assigns(:collection).map(&:id)).to eq([api_v3_country_of_destination1_node.id])
    end
  end
end
