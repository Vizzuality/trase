require "rails_helper"

RSpec.describe Admin::ChartsController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  describe "POST create" do
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_chart
      )
    }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_regexp).twice
      post :create, params: {api_v3_chart: valid_attributes}
    end
  end
end
