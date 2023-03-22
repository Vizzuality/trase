require "rails_helper"

RSpec.describe "Get staff groups", type: :request do
  include_context "staff members"

  describe "GET /content/staff_groups" do
    it "has the correct response structure" do
      get "/content/staff_groups"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema("staff_groups")
    end
  end
end
