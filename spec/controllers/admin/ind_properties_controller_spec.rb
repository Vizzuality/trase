require "rails_helper"

RSpec.describe Admin::IndPropertiesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }

  describe "POST create" do
    let(:ind) { FactoryBot.create(:api_v3_ind) }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_ind_property, ind_id: ind.id
      )
    }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_ind_property: valid_attributes}
    end
  end
end
