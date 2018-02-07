require 'rails_helper'

RSpec.describe Content::StaffMembersController, type: :controller do

  describe 'GET index' do
    # TODO: merge those databases and make database clearing work again
    before(:each) { Content::StaffMember.delete_all }
    it 'assigns staff members' do
      m1 = FactoryBot.create(:staff_member)
      m2 = FactoryBot.create(:staff_member)
      get :index
      expect(assigns(:staff_members)).to match_array([m1, m2])
    end
  end
end
