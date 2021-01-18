require 'rails_helper'

RSpec.describe Admin::IndContextPropertiesController, type: :controller do
  render_views

  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }

  describe 'POST create' do
    let(:ind) { FactoryBot.create(:api_v3_ind) }
    let(:ind_2) { FactoryBot.create(:api_v3_ind) }

    let(:context) { FactoryBot.create(:api_v3_context) }
    let(:context_2) { FactoryBot.create(:api_v3_context) }

    let(:tooltip_text) { 'Tooltip text' }
    let(:display_name) { 'Display name' }

    let(:old_valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_ind_context_property,
        ind_id: ind_2.id,
        context_id: context_2.id,
        tooltip_text: tooltip_text,
        display_name: display_name
      )
    }

    let(:new_valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_ind_context_property,
        ind_id: ind.id,
        context_id: context.id,
        tooltip_text: tooltip_text,
        display_name: display_name
      )
    }

    let!(:ind_context_property) {
      FactoryBot.create(:api_v3_ind_context_property, old_valid_attributes)
    }

    let(:duplicate) { old_valid_attributes }

    let(:no_ind_provided) { new_valid_attributes.except(:ind_id) }

    let(:no_context_provided) { new_valid_attributes.except(:context_id) }

    let(:no_tooltip_provided) { new_valid_attributes.except(:tooltip_text) }

    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_ind_context_property: new_valid_attributes}
    end

    it 'is successful when valid attributes' do
      post :create, params: {api_v3_ind_context_property: new_valid_attributes}
      expect(response).not_to render_template(:new)
    end

    it 'fails if ind is not provided' do
      post :create, params: {api_v3_ind_context_property: no_ind_provided}
      expect(response).to render_template(:new)
    end

    it 'fails if context is not provided' do
      post :create, params: {api_v3_ind_context_property: no_context_provided}
      expect(response).to render_template(:new)
    end

    it 'fails if tooltip is not provided' do
      post :create, params: {api_v3_ind_context_property: no_tooltip_provided}
      expect(response).to render_template(:new)
    end

    it 'fails if property with context and ind are already coupled' do
      post :create, params: {api_v3_ind_context_property: duplicate}
      expect(response).to render_template(:new)
    end

    it 'renders index' do
      get :index
      expect(response).to render_template(:index)
    end

    it 'renders show' do
      get :show, params: {id: ind_context_property.id}
      expect(response).to render_template(:show)
    end
  end
end
