require "rails_helper"

RSpec.describe Admin::StaffMembersController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  describe "POST create" do
    let(:valid_attributes) {
      FactoryBot.attributes_for(:staff_member).except(:image)
    }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_url)
      post :create, params: {content_staff_member: valid_attributes}
    end
  end
end
