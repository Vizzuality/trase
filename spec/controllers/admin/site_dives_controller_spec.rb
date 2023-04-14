require "rails_helper"

RSpec.describe Admin::SiteDivesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  describe "POST create" do
    let(:valid_attributes) { FactoryBot.attributes_for(:site_dive) }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_url)
      post :create, params: {content_site_dive: valid_attributes}
    end
  end
end
