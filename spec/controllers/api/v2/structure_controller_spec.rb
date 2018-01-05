require 'rails_helper'

RSpec.describe Api::V2::StructureController, type: :controller do
  include_context 'brazil soy indicators'
  include_context 'brazil resize by'
  include_context 'brazil recolor by'

  describe 'GET contexts' do
    it 'assigns contexts' do
      get :contexts
      controller_contexts = assigns(:contexts)
      expect(controller_contexts).to match_array([context, another_context])
      brazil_soy_context = controller_contexts.find { |e| e.id == context.id }
      expect(brazil_soy_context.context_resize_bies).to match_array([resize_by_area, resize_by_land_conflicts])
      expect(brazil_soy_context.context_recolor_bies).to match_array([recolor_by_forest_500, recolor_by_water_scarcity, recolor_by_biome])
    end
  end

  describe 'GET columns' do
    include_context 'brazil soy nodes'
    it 'assigns node_types' do
      get :columns, params: {context_id: context.id}
      expect(assigns(:node_types)).to eq([
        biome_node, state_node, municipality_node, logistics_hub_node, port1_node, exporter1_node, importer1_node, country_of_destination1_node
      ].map(&:node_type))
    end
  end
end
