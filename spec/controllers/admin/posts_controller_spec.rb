require "rails_helper"

RSpec.describe Admin::PostsController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  describe "POST create" do
    let(:valid_attributes) { FactoryBot.attributes_for(:post) }

    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_url)
      post :create, params: {content_post: valid_attributes}
    end

    it "creates a post" do
      post :create, params: {content_post: valid_attributes}
      post = Content::Post.order(:created_at).last
      expect(post.title).to eq(valid_attributes[:title])
    end

    it "saves attachment" do
      post :create, params: {
        content_post: valid_attributes.merge(
          image: Rack::Test::UploadedFile.new("#{Rails.root}/spec/support/fixtures/blank.jpg")
        )
      }
      post = Content::Post.order(:created_at).last
      expect(post.image_file_name).to eq("blank.jpg")
    end
  end
end
