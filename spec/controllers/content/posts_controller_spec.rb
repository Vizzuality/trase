require "rails_helper"

RSpec.describe Content::PostsController, type: :controller do
  describe "GET index" do
    it "assigns published posts" do
      p1 = FactoryBot.create(:post, state: 1)
      FactoryBot.create(:post, state: 0)
      get :index
      expect(assigns(:posts)).to match_array([p1])
    end
  end
end
