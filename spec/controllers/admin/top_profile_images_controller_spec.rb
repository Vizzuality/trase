require "rails_helper"

RSpec.describe Admin::TopProfileImagesController, type: :controller do
  render_views

  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }

  let(:top_profile_image) { FactoryBot.create(:api_v3_top_profile_image) }
  let(:commodity) { FactoryBot.create(:api_v3_commodity) }

  describe "rendering " do
    it "renders index" do
      get :index, params: {id: top_profile_image.id}
      expect(response).to render_template(:index)
    end

    it "renders show" do
      get :show, params: {id: top_profile_image.id}
      expect(response).to render_template(:show)
    end

    it "renders new" do
      post :create, params: {commodity: commodity, profile_type: "place"}
      expect(response).to render_template(:new)
    end
  end
end
