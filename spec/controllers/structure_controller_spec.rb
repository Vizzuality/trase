require 'rails_helper'

RSpec.describe StructureController, type: :controller do
  include_context "brazil soy indicators"
  describe "GET get_contexts" do
    it "assigns contexts" do
      get :get_contexts
      expect(assigns(:contexts)).to match_array([context, another_context])
    end
  end

  describe "GET get_columns" do
    include_context "brazil soy nodes"
    it "assigns node_types" do
      get :get_columns, params: {context_id: context.id}
      expect(assigns(:node_types)).to eq([
        biome, state, logistics_hub, municipality, exporter1, port1, importer1, country_of_destination1
      ].map(&:node_type))
    end
  end
end
