require "rails_helper"

RSpec.describe Content::TestimonialsController, type: :controller do
  describe "GET index" do
    it "assigns testimonials" do
      t1 = FactoryBot.create(:testimonial)
      t2 = FactoryBot.create(:testimonial)
      get :index
      expect(assigns(:testimonials)).to match_array([t1, t2])
    end
  end
end
