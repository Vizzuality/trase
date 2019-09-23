require 'rails_helper'

RSpec.describe Api::V3::Dashboards::CompaniesController, type: :controller do
  include_context 'api v3 brazil flows quants'
  include_context 'api v3 paraguay flows quants'
  include_context 'api v3 brazil soy profiles'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(
      sync: true, skip_dependencies: true, skip_dependents: true
    )
    Api::V3::Readonly::Dashboards::Company.refresh(sync: true, skip_dependencies: true)
  end

  describe 'GET search' do
    it 'returns companies by name' do
      get :search, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        q: 'afg'
      }
      expect(assigns(:collection).map(&:name)).to eq(
        [api_v3_exporter1_node.name]
      )
    end
  end

  describe 'GET index' do
    let(:all_results_alphabetically) {
      [
        api_v3_exporter1_node,
        api_v3_importer1_node,
        api_v3_other_exporter_node,
        api_v3_other_importer_node
      ]
    }

    it 'returns list in alphabetical order' do
      get :index, params: {
        countries_ids: api_v3_brazil.id,
        node_types_ids: [
          api_v3_exporter_node_type.id, api_v3_importer_node_type.id
        ].join(',')
      }
      expect(assigns(:collection).map(&:name)).to eq(
        all_results_alphabetically.map(&:name)
      )
    end

    it 'returns companies by id' do
      get :index, params: {
        countries_ids: [api_v3_brazil.id].join(','),
        companies_ids: api_v3_exporter1_node.id
      }
      expect(assigns(:collection).map(&:id)).to eq(
        [api_v3_exporter1_node.id]
      )
    end

    context 'when filter with node_ids' do
      it 'returns companies with the specified nodes' do
        get :index, params: {
          countries_ids: [api_v3_brazil.id].join(','),
          sources_ids: [api_v3_biome_node.id].join(','),
          destinations_ids: [api_v3_country_of_destination1_node.id].join(','),
          node_types_ids: [api_v3_exporter_node_type.id].join(',')
        }
        expect(assigns(:collection).map(&:id)).to eq(
          [api_v3_exporter1_node.id, api_v3_other_exporter_node.id]
        )
      end
    end

    let(:per_page) { 1 }

    it 'accepts per_page' do
      get :index, params: {countries_ids: api_v3_brazil.id, per_page: per_page}
      expect(assigns(:collection).size).to eq(per_page)
    end

    context 'when profile_only' do
      it 'returns companies with profiles' do
        get :index, params: {profile_only: true}
        expect(assigns(:collection).map(&:id)).to eq(
          [api_v3_exporter1_node.id, api_v3_importer1_node.id]
        )
      end
    end
  end
end
