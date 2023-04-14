require "rails_helper"

RSpec.describe Admin::QuantPropertiesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }

  describe "POST create" do
    let(:quant) { FactoryBot.create(:api_v3_quant) }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_quant_property, quant_id: quant.id
      )
    }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_quant_property: valid_attributes}
    end
  end
end
