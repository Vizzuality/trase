require "rails_helper"

RSpec.describe Admin::MapAttributesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }

  describe "POST create" do
    let(:map_attribute_group) {
      FactoryBot.create(:api_v3_map_attribute_group)
    }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_map_attribute, map_attribute_group_id: map_attribute_group.id
      )
    }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_map_attribute: valid_attributes}
    end
  end
end
