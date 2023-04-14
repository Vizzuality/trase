require "rails_helper"

RSpec.describe "Health", type: :request do
  describe "GET /health" do
    it "is healthy" do
      get "/health"

      expect(@response).to have_http_status(:no_content)
    end
  end
end
