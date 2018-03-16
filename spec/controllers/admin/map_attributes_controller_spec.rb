require 'rails_helper'

RSpec.describe Admin::MapAttributesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  before do
    Api::V3::MapAttributeGroup.skip_callback(:commit, :after, :refresh_dependencies)
    Api::V3::MapAttribute.skip_callback(:commit, :after, :refresh_dependencies)
  end
  after do
    Api::V3::MapAttributeGroup.set_callback(:commit, :after, :refresh_dependencies)
    Api::V3::MapAttribute.set_callback(:commit, :after, :refresh_dependencies)
  end
  describe 'POST create' do
    let(:map_attribute_group) {
      FactoryBot.create(:api_v3_map_attribute_group)
    }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_map_attribute, map_attribute_group_id: map_attribute_group.id
      )
    }
    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_map_attribute: valid_attributes}
    end
  end
end
