require "rails_helper"

RSpec.describe Content::SiteDivesController, type: :controller do
  describe "GET show" do
    it "assigns site dive" do
      sd = FactoryBot.create(:site_dive)
      get :show, params: {id: sd.id}
      expect(assigns(:site_dive)).to eq(sd)
    end
  end
end
