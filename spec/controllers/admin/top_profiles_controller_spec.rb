require 'rails_helper'

RSpec.describe Admin::TopProfilesController, type: :controller do
  render_views
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  before :each do
    allow(controller).to receive(:derive_top_profile_details).and_return(true)
  end

  let(:context) { FactoryBot.create(:api_v3_context) }
  let(:node) { FactoryBot.create(:api_v3_node) }
  let(:top_profile) { FactoryBot.create(:api_v3_top_profile) }

  describe 'POST create' do
    subject { Api::V3::TopProfile.new(context: context, node: node) }

    let(:top_profile) {
      FactoryBot.create(
        :api_v3_top_profile, context: context, node: FactoryBot.create(:api_v3_node)
      )
    }
    let(:valid_attributes) {
      {context_id: context.id, node_id: FactoryBot.create(:api_v3_node).id}
    }
    it 'redirects to index' do
      post :create, params: {
        context_id: context.id, api_v3_top_profile: valid_attributes
      }
      expect(response).to redirect_to(edit_admin_context_top_profile_path(Api::V3::TopProfile.last.context_id, Api::V3::TopProfile.last.id))
    end

    it 'renders index' do
      get :index, params: { context_id: context.id, id: top_profile.id }
      expect(response).to render_template(:index)
    end

    it 'renders show' do
      get :show, params: {context_id: context.id, id: top_profile.id}
      expect(response).to render_template(:show)
    end

    it 'renders index' do
      get :new, params: { context_id: context.id }
      expect(response).to render_template(:new)
    end
  end

  describe 'PUT update' do
    let(:top_profile) {
      FactoryBot.create(
        :api_v3_top_profile, context: context, node: FactoryBot.create(:api_v3_node)
      )
    }
    let(:top_profile_image) {
      FactoryBot.create(
        :api_v3_top_profile_image,
        commodity: context.commodity
      )
    }
    let(:valid_attributes) {
      {context_id: context.id, node_id: FactoryBot.create(:api_v3_node).id}
    }
    it 'redirects to index' do
      put :update, params: {
        context_id: context.id, id: top_profile.id, api_v3_top_profile: valid_attributes, resource: {top_profile_image_id: top_profile_image.id}
      }
      expect(response).to redirect_to(admin_context_top_profiles_path(context))
    end
  end
end
