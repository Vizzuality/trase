RSpec.describe Admin::ContextNodeTypePropertiesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  describe "POST create" do
    let(:context_node_type) { FactoryBot.create(:api_v3_context_node_type) }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_context_node_type_property,
        context_node_type_id: context_node_type.id
      )
    }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {
        api_v3_context_node_type_property: valid_attributes
      }
    end
  end
end
