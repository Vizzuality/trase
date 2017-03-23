require 'rails_helper'

RSpec.describe PlaceFactsheetController, type: :controller do
  include_context 'brazil soy indicators'
  include_context 'brazil soy nodes'

  describe 'GET get_place_node_attributes loads basic data' do
    it 'gets basic place data' do
      get :place_data, params: { context_id: context.id, node_id: state.id }
      expect(assigns(:result)).to include('state_name', 'state_geo_id', :type, :name, :geo_id)
      expect(assigns(:result)).not_to include('municipality_name', 'municipality_geo_id', 'biome_name', 'biome_geo_id')
    end

    it 'gets parent data for child nodes' do
      get :place_data, params: { context_id: context.id, node_id: municipality.id }
      expect(assigns(:result)).to include('municipality_name', 'municipality_geo_id', 'state_name', 'state_geo_id', 'biome_name', 'biome_geo_id', :type, :name, :geo_id)
    end
  end
  describe 'GET get_place_node_attributes loads single value metrics' do
    include_context 'brazil quant values'
    it 'gets single value metrics' do
      get :place_data, params: { context_id: context.id, node_id: municipality.id }
      expect(assigns(:result)[:single_value_metrics]).to match_array([forest_500, total_defor_rate, zero_deforestation])
    end
  end
end
