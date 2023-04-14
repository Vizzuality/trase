require "rails_helper"

RSpec.describe "Get posts", type: :request do
  include_context "posts"

  describe "GET /content/posts" do
    it "has the correct response structure" do
      get "/content/posts"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema("posts")
    end
  end
end
