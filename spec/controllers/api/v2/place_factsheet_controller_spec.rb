require 'rails_helper'

RSpec.describe Api::V2::PlaceFactsheetController, type: :controller do
  include_context 'brazil soy indicators'
  include_context 'brazil soy nodes'
  include_context 'quals'

  let!(:node_qual_biome) do
    FactoryBot.create(:node_qual, qual: biome, node: municipality_node, value: biome_node.name)
  end
  let!(:node_qual_state) do
    FactoryBot.create(:node_qual, qual: state, node: municipality_node, value: state_node.name)
  end

  let!(:municipality_total_defor_rate_2015) do
    FactoryBot.create(:node_quant, quant: deforestation_v2, value: 1000, year: 2015, node: municipality_node)
  end

  describe 'GET get_place_node_attributes loads basic data' do
    it 'gets basic place data' do
      get :place_data, params: {context_id: context.id, node_id: state_node.id}
      expect(assigns(:result)[:data].keys).to include(:state_name, :state_geo_id, :state_geo_id)
      expect(assigns(:result)[:data].keys).not_to include(:municipality_name, :municipality_geo_id, :biome_name, :biome_geo_id)
    end

    it 'gets parent data for child nodes' do
      get :place_data, params: {context_id: context.id, node_id: municipality_node.id}
      expect(assigns(:result)[:data].keys).to include(:municipality_name, :municipality_geo_id, :state_name, :state_geo_id, :biome_name, :biome_geo_id, :biome_geo_id)
    end
  end
end
