require "rails_helper"

RSpec.describe Admin::CountryPropertiesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  describe "POST create" do
    let(:country) { FactoryBot.create(:api_v3_country) }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_country_property, country_id: country.id
      )
    }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_url)
      post :create, params: {api_v3_country_property: valid_attributes}
    end
  end
end
