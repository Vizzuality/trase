require 'rails_helper'

RSpec.describe Content::TestimonialsController, type: :controller do
  describe 'GET index' do
    # TODO: merge those databases and make database clearing work again
    before(:each) { Content::Testimonial.delete_all }
    it 'assigns testimonials' do
      t1 = FactoryBot.create(:testimonial)
      t2 = FactoryBot.create(:testimonial)
      get :index
      expect(assigns(:testimonials)).to match_array([t1, t2])
    end
  end
end
