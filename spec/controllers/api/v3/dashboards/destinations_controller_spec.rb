require 'rails_helper'

RSpec.describe Api::V3::Dashboards::DestinationsController, type: :controller do
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(
      sync: true, skip_dependencies: true, skip_dependents: true
    )
    Api::V3::Readonly::NodesPerContextRankedByVolumePerYear.refresh(
      sync: true, skip_dependencies: true, skip_dependents: true
    )
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(
      sync: true, skip_dependencies: true, skip_dependents: true
    )
    Api::V3::Readonly::Dashboards::Destination.refresh(sync: true, skip_dependencies: true)
  end

  describe 'GET search' do
    it 'returns destinations by name' do
      get :search, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        q: 'rus'
      }
      expect(assigns(:collection).map(&:name)).to eq(
        [api_v3_country_of_destination1_node.name]
      )
    end
  end

  describe 'GET index' do
    let(:all_results_alphabetically) {
      [
        api_v3_country_of_destination2_node,
        api_v3_country_of_destination1_node
      ]
    }

    it 'returns list in alphabetical order' do
      get :index, params: {countries_ids: [api_v3_brazil.id].join(',')}
      expect(assigns(:collection).map(&:name)).to eq(
        all_results_alphabetically.map(&:name)
      )
    end

    it 'returns destinations by id' do
      get :index, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        destinations_ids: api_v3_country_of_destination1_node.id
      }
      expect(assigns(:collection).map(&:id)).to eq(
        [api_v3_country_of_destination1_node.id]
      )
    end

    let(:per_page) { 1 }

    it 'accepts per_page' do
      get :index, params: {
        countries_ids: [api_v3_brazil.id].join(','), per_page: per_page
      }
      expect(assigns(:collection).size).to eq(per_page)
    end

    it 'allows multiple destinations selection' do
      get :index, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        destinations_ids: [api_v3_country_of_destination1_node.id, api_v3_country_of_destination2_node.id].join(',')
      }
      expect(assigns(:collection).map(&:id)).to eq([api_v3_country_of_destination2_node.id, api_v3_country_of_destination1_node.id])
    end
  end
end
