require "rails_helper"

RSpec.describe Admin::CartoLayersController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  describe "POST create" do
    let(:contextual_layer) { FactoryBot.create(:api_v3_contextual_layer) }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_carto_layer, contextual_layer_id: contextual_layer.id
      )
    }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_carto_layer: valid_attributes}
    end
  end
end
