require 'rails_helper'

RSpec.describe Admin::IndContextPropertiesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }

  describe 'POST create' do
    let(:ind) { FactoryBot.create(:api_v3_ind) }
    let(:context) { FactoryBot.create(:api_v3_context) }
    let(:tooltip_text) { 'Tooltip text' }

    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_ind_context_property,
        ind_id: ind.id,
        context_id: context.id,
        tooltip_text: tooltip_text
      )
    }

    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_ind_context_property: valid_attributes}
    end
  end
end
