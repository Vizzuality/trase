require 'rails_helper'

RSpec.describe Admin::IndPropertiesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  before do
    Api::V3::IndProperty.skip_callback(:commit, :after, :refresh_dependencies)
  end
  after do
    Api::V3::IndProperty.set_callback(:commit, :after, :refresh_dependencies)
  end
  describe 'POST create' do
    let(:ind) { FactoryBot.create(:api_v3_ind) }
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_ind_property, ind_id: ind.id
      )
    }
    it 'clears cache' do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {api_v3_ind_property: valid_attributes}
    end
  end
end
