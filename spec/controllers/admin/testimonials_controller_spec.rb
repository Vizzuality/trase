require "rails_helper"

RSpec.describe Admin::TestimonialsController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  describe "POST create" do
    let(:valid_attributes) {
      FactoryBot.attributes_for(:testimonial).except(:image)
    }

    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_url)
      post :create, params: {content_testimonial: valid_attributes}
    end

    it "creates a testimonial" do
      post :create, params: {content_testimonial: valid_attributes}
      testimonial = Content::Testimonial.order(:created_at).last
      expect(testimonial.quote).to eq(valid_attributes[:quote])
    end

    it "saves attachment" do
      post :create, params: {
        content_testimonial: valid_attributes.merge(
          image: Rack::Test::UploadedFile.new("#{Rails.root}/spec/support/fixtures/blank.jpg")
        )
      }
      testimonial = Content::Testimonial.order(:created_at).last
      expect(testimonial.image_file_name).to eq("blank.jpg")
    end
  end
end
