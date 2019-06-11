require 'rails_helper'

RSpec.describe Admin::ResizeByAttributesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  let(:context) { FactoryBot.create(:api_v3_context) }

  describe 'POST create' do
    let(:valid_attributes) {
      FactoryBot.attributes_for(:api_v3_resize_by_attribute)
    }
    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {
        context_id: context.id, api_v3_resize_by_attribute: valid_attributes
      }
    end
    it 'redirects to index' do
      post :create, params: {
        context_id: context.id, api_v3_resize_by_attribute: valid_attributes
      }
      expect(response).to redirect_to(admin_context_resize_by_attributes_path(context))
    end
  end

  describe 'PUT update' do
    let(:resize_by_attribute) {
      FactoryBot.create(:api_v3_resize_by_attribute, context: context)
    }
    let!(:resize_by_quant) {
      FactoryBot.create(
        :api_v3_resize_by_quant, resize_by_attribute: resize_by_attribute
      )
    }
    let(:valid_attributes) {
      FactoryBot.attributes_for(:api_v3_resize_by_attribute)
    }
    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      put :update, params: {
        context_id: context.id, id: resize_by_attribute.id, api_v3_resize_by_attribute: valid_attributes
      }
    end
    it 'redirects to index' do
      put :update, params: {
        context_id: context.id, id: resize_by_attribute.id, api_v3_resize_by_attribute: valid_attributes
      }
      expect(response).to redirect_to(admin_context_resize_by_attributes_path(context))
    end
  end
end
