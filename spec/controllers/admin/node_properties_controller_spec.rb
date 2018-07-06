require 'rails_helper'

RSpec.describe Admin::NodePropertiesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  before do
    Api::V3::NodeProperty.skip_callback(:commit, :after, :refresh_dependencies)
  end
  after do
    Api::V3::NodeProperty.set_callback(:commit, :after, :refresh_dependencies)
  end
  describe 'POST create' do
    let(:node) { FactoryBot.create(:api_v3_node) }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_node_property, node_id: node.id
      )
    }
    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_node_property: valid_attributes}
    end
  end
end
