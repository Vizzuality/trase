require 'rails_helper'

RSpec.describe Admin::DashboardsAttributeGroupsController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  before do
    Api::V3::DashboardsAttributeGroup.skip_callback(:commit, :after, :refresh_dependents)
  end
  after do
    Api::V3::DashboardsAttributeGroup.set_callback(:commit, :after, :refresh_dependents)
  end
  describe 'POST create' do
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_dashboards_attribute_group, chart_type: 'line'
      )
    }
    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_chart_attribute_group: valid_attributes}
    end
  end
end
