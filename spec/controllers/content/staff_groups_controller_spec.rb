require "rails_helper"

RSpec.describe Content::StaffGroupsController, type: :controller do
  describe "GET index" do
    it "assigns staff members" do
      g1 = FactoryBot.create(:staff_group)
      m1 = FactoryBot.create(:staff_member, staff_group: g1)
      m2 = FactoryBot.create(:staff_member, staff_group: g1)
      get :index
      expect(assigns(:staff_groups)).to match_array([g1])
      expect(assigns(:staff_groups).first.staff_members).to match_array([m1, m2])
    end
  end
end
