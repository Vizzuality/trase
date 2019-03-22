require 'rails_helper'

RSpec.describe Admin::IndCountryPropertiesController, type: :controller do
  render_views

  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }

  describe 'POST create' do
    let(:ind) { FactoryBot.create(:api_v3_ind) }
    let(:ind_2) { FactoryBot.create(:api_v3_ind) }

    let(:country) { FactoryBot.create(:api_v3_country) }
    let(:country_2) { FactoryBot.create(:api_v3_country) }

    let(:tooltip_text) { 'Tooltip text' }

    let!(:ind_country_property) {
      FactoryBot.create(
        :api_v3_ind_country_property,
        ind_id: ind_2.id,
        country_id: country_2.id,
        tooltip_text: tooltip_text
      )
    }

    let(:duplicate) {
      FactoryBot.attributes_for(
        :api_v3_ind_country_property,
        ind_id: ind_2.id,
        country_id: country_2.id,
        tooltip_text: tooltip_text
      )
    }

    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_ind_country_property,
        ind_id: ind.id,
        country_id: country.id,
        tooltip_text: tooltip_text
      )
    }

    let(:no_ind_provided) {
      FactoryBot.attributes_for(
        :api_v3_ind_country_property,
        ind_id: nil,
        country_id: country.id,
        tooltip_text: tooltip_text
      )
    }

    let(:no_country_provided) {
      FactoryBot.attributes_for(
        :api_v3_ind_country_property,
        ind_id: ind.id,
        country_id: nil,
        tooltip_text: tooltip_text
      )
    }

    let(:no_tooltip_provided) {
      FactoryBot.attributes_for(
        :api_v3_ind_country_property,
        ind_id: ind.id,
        country_id: country.id,
        tooltip_text: nil
      )
    }

    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_ind_country_property: valid_attributes}
    end

    it 'fails if ind is not provided' do
      post :create, params: {api_v3_ind_country_property: no_ind_provided}
      expect(response).to render_template(:new)
    end

    it 'fails if country is not provided' do
      post :create, params: {api_v3_ind_country_property: no_country_provided}
      expect(response).to render_template(:new)
    end

    it 'fails if tooltip is not provided' do
      post :create, params: {api_v3_ind_country_property: no_tooltip_provided}
      expect(response).to render_template(:new)
    end

    it 'fails if property with country and ind are already coupled' do
      post :create, params: {api_v3_ind_country_property: duplicate}
      expect(response).to render_template(:new)
    end

    it 'renders index' do
      get :index
      expect(response).to render_template(:index)
    end

    it 'renders show' do
      get :show, params: {id: ind_country_property.id}
      expect(response).to render_template(:show)
    end
  end
end
