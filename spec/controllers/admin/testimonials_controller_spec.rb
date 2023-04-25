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
  end
end
