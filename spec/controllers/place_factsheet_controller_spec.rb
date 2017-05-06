require 'rails_helper'

RSpec.describe PlaceFactsheetController, type: :controller do
  include_context 'brazil soy indicators'
  include_context 'brazil soy nodes'

  let(:qual_biome){
    FactoryGirl.create(:qual, name: NodeTypeName::BIOME, place_factsheet: true, place_factsheet_temporal: false)
  }
  let(:qual_state){
    FactoryGirl.create(:qual, name: NodeTypeName::STATE, place_factsheet: true, place_factsheet_temporal: false)
  }
  let!(:node_qual_biome){
    FactoryGirl.create(:node_qual, qual: qual_biome, node: municipality, value: biome.name)
  }
  let!(:node_qual_state){
    FactoryGirl.create(:node_qual, qual: qual_state, node: municipality, value: state.name)
  }

  let!(:municipality_total_defor_rate_2015){
    FactoryGirl.create(:node_ind, ind: total_defor_rate, value: 1000, year: 2015, node: municipality)
  }

  describe 'GET get_place_node_attributes loads basic data' do
    it 'gets basic place data' do
      get :place_data, params: { context_id: context.id, node_id: state.id }
      expect(assigns(:result)[:data].keys).to include(:state_name, :state_geo_id, :state_geo_id)
      expect(assigns(:result)[:data].keys).not_to include(:municipality_name, :municipality_geo_id, :biome_name, :biome_geo_id)
    end

    it 'gets parent data for child nodes' do
      get :place_data, params: { context_id: context.id, node_id: municipality.id }
      expect(assigns(:result)[:data].keys).to include(:municipality_name, :municipality_geo_id, :state_name, :state_geo_id, :biome_name, :biome_geo_id, :biome_geo_id)
    end
  end
end
