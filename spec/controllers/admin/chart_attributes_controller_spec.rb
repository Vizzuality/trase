require "rails_helper"

RSpec.describe Admin::ChartAttributesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  describe "POST create" do
    let(:chart) {
      FactoryBot.create(:api_v3_chart)
    }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_chart_attribute, chart_id: chart.id
      )
    }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_regexp).twice
      post :create, params: {api_v3_chart_attribute: valid_attributes}
    end
  end
end
