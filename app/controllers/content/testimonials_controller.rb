module Content
  class TestimonialsController < ApplicationController
    before_action :set_caching_headers

    def index
      testimonials = Content::Testimonial.order(created_at: 'DESC')
      render json: testimonials, root: 'data', each_serializer: TestimonialSerializer
    end
  end
end
