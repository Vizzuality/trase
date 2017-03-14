require 'rails_helper'

RSpec.describe IndicatorsController, type: :controller do
  include_context "brazil soy indicators"
  describe "GET index" do
    it "assigns indicators relevant to the given context" do
      get :index, params: { country: 'BRAZIL', commodity: 'SOY' }
      expect(assigns(:context)).to eq(context)
      expect(assigns(:indicators)).to match_array([forest_500, total_defor_rate, zero_deforestation])
    end
  end
end
