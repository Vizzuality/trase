require "rails_helper"

RSpec.describe Admin::DownloadAttributesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }

  describe "POST create" do
    let(:context) { FactoryBot.create(:api_v3_context) }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_download_attribute, context_id: context.id
      )
    }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_download_attribute: valid_attributes}
    end
  end
end
