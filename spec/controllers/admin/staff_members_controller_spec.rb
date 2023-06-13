require "rails_helper"

RSpec.describe Admin::StaffMembersController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  describe "POST create" do
    let(:staff_group) { FactoryBot.create(:staff_group) }
    let(:valid_attributes) {
      FactoryBot.attributes_for(:staff_member).except(:image).merge(staff_group_id: staff_group.id)
    }

    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_url)
      post :create, params: {content_staff_member: valid_attributes}
    end

    it "creates a staff member" do
      post :create, params: {content_staff_member: valid_attributes}
      staff_member = Content::StaffMember.order(:created_at).last
      expect(staff_member.name).to eq(valid_attributes[:name])
    end

    it "saves attachment" do
      post :create, params: {
        content_staff_member: valid_attributes.merge(
          image: Rack::Test::UploadedFile.new("#{Rails.root}/spec/support/fixtures/blank.jpg")
        )
      }
      staff_member = Content::StaffMember.order(:created_at).last
      expect(staff_member.image_file_name).to eq("blank.jpg")
    end
  end
end
