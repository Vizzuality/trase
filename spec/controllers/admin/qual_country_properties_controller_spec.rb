require 'rails_helper'

RSpec.describe Admin::QualCountryPropertiesController, type: :controller do
  render_views

  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }

  describe 'POST create' do
    let(:qual) { FactoryBot.create(:api_v3_qual) }
    let(:qual_2) { FactoryBot.create(:api_v3_qual) }

    let(:country) { FactoryBot.create(:api_v3_country) }
    let(:country_2) { FactoryBot.create(:api_v3_country) }

    let(:tooltip_text) { 'Tooltip text' }

    let!(:qual_country_property) {
      FactoryBot.create(
        :api_v3_qual_country_property,
        qual_id: qual_2.id,
        country_id: country_2.id,
        tooltip_text: tooltip_text
      )
    }

    let(:duplicate) {
      FactoryBot.attributes_for(
        :api_v3_qual_country_property,
        qual_id: qual_2.id,
        country_id: country_2.id,
        tooltip_text: tooltip_text
      )
    }

    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_qual_country_property,
        qual_id: qual.id,
        country_id: country.id,
        tooltip_text: tooltip_text
      )
    }

    let(:no_qual_provided) {
      FactoryBot.attributes_for(
        :api_v3_qual_country_property,
        qual_id: nil,
        country_id: country.id,
        tooltip_text: tooltip_text
      )
    }

    let(:no_country_provided) {
      FactoryBot.attributes_for(
        :api_v3_qual_country_property,
        qual_id: qual.id,
        country_id: nil,
        tooltip_text: tooltip_text
      )
    }

    let(:no_tooltip_provided) {
      FactoryBot.attributes_for(
        :api_v3_qual_country_property,
        qual_id: qual.id,
        country_id: country.id,
        tooltip_text: nil
      )
    }

    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_qual_country_property: valid_attributes}
    end

    it 'fails if qual is not provided' do
      post :create, params: {api_v3_qual_country_property: no_qual_provided}
      expect(response).to render_template(:new)
    end

    it 'fails if country is not provided' do
      post :create, params: {api_v3_qual_country_property: no_country_provided}
      expect(response).to render_template(:new)
    end

    it 'fails if tooltip is not provided' do
      post :create, params: {api_v3_qual_country_property: no_tooltip_provided}
      expect(response).to render_template(:new)
    end

    it 'fails if property with country and qual are already coupled' do
      post :create, params: {api_v3_qual_country_property: duplicate}
      expect(response).to render_template(:new)
    end

    it 'renders index' do
      get :index
      expect(response).to render_template(:index)
    end
  end
end
