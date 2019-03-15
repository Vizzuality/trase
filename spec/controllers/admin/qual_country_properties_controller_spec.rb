require 'rails_helper'

RSpec.describe Admin::QualCountryPropertiesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }

  describe 'POST create' do
    let(:qual) { FactoryBot.create(:api_v3_qual) }
    let(:country) { FactoryBot.create(:api_v3_country) }
    let(:tooltip_text) { 'Tooltip text' }

    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_qual_country_property,
        qual_id: qual.id,
        country_id: country.id,
        tooltip_text: tooltip_text
      )
    }

    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_qual_country_property: valid_attributes}
    end
  end
end
