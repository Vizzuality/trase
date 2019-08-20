require 'rails_helper'

RSpec.describe Admin::TopProfilesController, type: :controller do
  render_views

  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil exporter actor profile'

  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }

  let(:context) { api_v3_context }
  let(:node) { api_v3_exporter1_node }

  describe 'POST create' do
    before(:each) do
      Api::V3::Readonly::Node.refresh(sync: true)
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::ChartAttribute.refresh(sync: true, skip_dependencies: true)
    end

    let(:top_profile) {
      FactoryBot.create(
        :api_v3_top_profile, context: context, node: node
      )
    }
    let(:valid_attributes) {
      {context_id: context.id, node_id: node.id}
    }
    it 'redirects to index' do
      post :create, params: {
        context_id: context.id, api_v3_top_profile: valid_attributes
      }
      expect(response).to redirect_to(edit_admin_context_top_profile_path(Api::V3::TopProfile.last.context_id, Api::V3::TopProfile.last.id))
    end

    it 'renders index' do
      get :index, params: {context_id: context.id, id: top_profile.id}
      expect(response).to render_template(:index)
    end

    it 'renders show' do
      get :show, params: {context_id: context.id, id: top_profile.id}
      expect(response).to render_template(:show)
    end

    it 'renders index' do
      get :new, params: {context_id: context.id}
      expect(response).to render_template(:new)
    end
  end

  describe 'PUT update' do
    before(:each) do
      Api::V3::Readonly::Node.refresh(sync: true)
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::ChartAttribute.refresh(sync: true, skip_dependencies: true)
    end

    let(:top_profile) {
      FactoryBot.create(
        :api_v3_top_profile, context: context, node: node
      )
    }
    let(:top_profile_image) {
      FactoryBot.create(
        :api_v3_top_profile_image,
        commodity: context.commodity
      )
    }
    let(:valid_attributes) {
      {context_id: context.id, node_id: node.id}
    }
    it 'redirects to index' do
      put :update, params: {
        context_id: context.id, id: top_profile.id, api_v3_top_profile: valid_attributes, resource: {top_profile_image_id: top_profile_image.id}
      }
      expect(response).to redirect_to(admin_context_top_profiles_path(context))
    end
  end
end
