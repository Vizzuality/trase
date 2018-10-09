require 'rails_helper'

RSpec.describe Admin::DashboardsAttributesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  before do
    Api::V3::DashboardsAttributeGroup.skip_callback(:commit, :after, :refresh_dependents)
    Api::V3::DashboardsAttribute.skip_callback(:commit, :after, :refresh_dependents)
  end
  after do
    Api::V3::DashboardsAttributeGroup.set_callback(:commit, :after, :refresh_dependents)
    Api::V3::DashboardsAttribute.set_callback(:commit, :after, :refresh_dependents)
  end
  describe 'POST create' do
    let(:dashboards_attribute_group) {
      FactoryBot.create(:api_v3_dashboards_attribute_group)
    }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_dashboards_attribute, dashboards_attribute_group_id: dashboards_attribute_group.id
      )
    }
    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_dashboards_attribute: valid_attributes}
    end
  end
end
