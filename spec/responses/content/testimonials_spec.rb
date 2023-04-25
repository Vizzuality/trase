require "rails_helper"

RSpec.describe "Get testimonials", type: :request do
  include_context "testimonials"

  describe "GET /content/testimonials" do
    it "has the correct response structure" do
      get "/content/testimonials"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema("testimonials")
    end
  end
end
