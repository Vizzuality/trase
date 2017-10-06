require 'rails_helper'

RSpec.describe StructureController, type: :controller do
  include_context "brazil soy indicators"
  include_context "brazil resize by"
  include_context "brazil recolor by"

  describe "GET get_contexts" do
    it "assigns contexts" do
      get :get_contexts
      controller_contexts = assigns(:contexts)
      expect(controller_contexts).to match_array([context, another_context])
      expect(controller_contexts.find_by("countries.name ILIKE 'Brazil'").context_resize_bies).to match_array([resize_by_area, resize_by_land_conflicts])
      expect(controller_contexts.find_by("countries.name ILIKE 'Brazil'").context_recolor_bies).to match_array([recolor_by_forest_500, recolor_by_water_scarcity, recolor_by_biome])
    end
  end

  describe "GET get_columns" do
    include_context "brazil soy nodes"
    it "assigns node_types" do
      get :get_columns, params: {context_id: context.id}
      expect(assigns(:node_types)).to eq([
        biome, state, municipality, logistics_hub, port1, exporter1, importer1, country_of_destination1
      ].map(&:node_type))
    end
  end
end
