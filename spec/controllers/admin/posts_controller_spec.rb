require "rails_helper"

RSpec.describe Admin::PostsController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  describe "POST create" do
    let(:valid_attributes) { FactoryBot.attributes_for(:post) }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_url)
      post :create, params: {post: valid_attributes}
    end
  end
end
