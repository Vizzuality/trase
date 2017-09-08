require 'rails_helper'

RSpec.describe IndicatorsController, type: :controller do
  include_context "brazil soy indicators"
  describe "GET index" do
    it "assigns indicators relevant to the given context" do
      get :index, params: { context_id: context.id }
      expect(assigns(:context)).to eq(context)
      expect(assigns(:indicators)).to match_array([forest_500, deforestation_v2, zero_deforestation])
    end
  end
end
