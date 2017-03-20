require 'rails_helper'

RSpec.describe StructureController, type: :controller do
  include_context "brazil soy indicators"
  describe "GET get_contexts" do
    it "assigns contexts" do
      get :get_contexts
      expect(assigns(:contexts)).to match_array([context, another_context])
    end
  end
end
