require 'rails_helper'

RSpec.describe Api::V3::Dashboards::SourcesController, type: :controller do
  include_context 'api v3 brazil flows quants'
  include_context 'api v3 paraguay flows quants'
  include_context 'api v3 brazil soy profiles'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(
      sync: true, skip_dependencies: true, skip_dependents: true
    )
    Api::V3::Readonly::Dashboards::Source.refresh(sync: true, skip_dependencies: true)
  end

  describe 'GET search' do
    it 'returns sources by name' do
      get :search, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        q: 'ubi'
      }
      expect(assigns(:collection).map(&:id)).to eq([api_v3_municipality_node.id])
    end
  end

  describe 'GET index' do
    let(:all_results_alphabetically) {
      [
        api_v3_biome_node,
        api_v3_state_node,
        api_v3_municipality_node,
        api_v3_municipality2_node
      ]
    }

    it 'returns list in alphabetical order' do
      get :index, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        node_types_ids: [
          api_v3_biome_node_type.id,
          api_v3_state_node_type.id,
          api_v3_municipality_node_type.id
        ].join(',')
      }
      expect(assigns(:collection).map(&:name)).to eq(
        all_results_alphabetically.map(&:name)
      )
    end

    it 'returns sources by id' do
      get :index, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        sources_ids: api_v3_municipality_node.id
      }
      expect(assigns(:collection).map(&:id)).to eq(
        [api_v3_municipality_node.id]
      )
    end

    let(:per_page) { 1 }

    it 'accepts per_page' do
      get :index, params: {
        countries_ids: [api_v3_brazil.id].join(','), per_page: per_page
      }
      expect(assigns(:collection).size).to eq(per_page)
    end

    context 'when profile_only' do
      it 'returns sources with profiles' do
        get :index, params: {
          countries_ids: [api_v3_brazil.id].join(','),
          sources_ids: api_v3_municipality_node.id,
          profile_only: true
        }
        expect(assigns(:collection).map(&:id)).to eq([api_v3_municipality_node.id])
      end
    end
  end
end
