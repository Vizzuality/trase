require 'rails_helper'

RSpec.describe Admin::ResizeByAttributesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  before do
    Api::V3::ResizeByAttribute.skip_callback(:commit, :after, :refresh_dependents)
  end
  after do
    Api::V3::ResizeByAttribute.set_callback(:commit, :after, :refresh_dependents)
  end
  describe 'POST create' do
    let(:context) { FactoryBot.create(:api_v3_context) }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_resize_by_attribute, context_id: context.id
      )
    }
    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_resize_by_attribute: valid_attributes}
    end
  end
end
