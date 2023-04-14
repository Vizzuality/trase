require "rails_helper"

RSpec.describe Admin::RecolorByAttributesController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  let(:context) { FactoryBot.create(:api_v3_context) }

  describe "POST create" do
    let(:valid_attributes) {
      FactoryBot.attributes_for(
        :api_v3_recolor_by_attribute, context_id: context.id
      )
    }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_regexp)
      post :create, params: {
        context_id: context.id, api_v3_recolor_by_attribute: valid_attributes
      }
    end
    it "redirects to index" do
      post :create, params: {
        context_id: context.id, api_v3_recolor_by_attribute: valid_attributes
      }
      expect(response).to redirect_to(admin_context_recolor_by_attributes_path(context))
    end
    context "managing download attribute" do
      it "is_downloadable = true" do
        expect_any_instance_of(Api::V3::ManageDownloadAttribute).to receive(:call).with("true", "AAA")
        post :create, params: {
          context_id: context.id,
          api_v3_recolor_by_attribute: valid_attributes.merge(is_downloadable: "true", download_name: "AAA")
        }
      end
      it "is_downloadable = false" do
        expect_any_instance_of(Api::V3::ManageDownloadAttribute).to receive(:call).with("false", nil)
        post :create, params: {
          context_id: context.id,
          api_v3_recolor_by_attribute: valid_attributes.merge(is_downloadable: "false")
        }
      end
    end
  end

  describe "PUT update" do
    let(:recolor_by_attribute) {
      FactoryBot.create(:api_v3_recolor_by_attribute, context: context)
    }
    let!(:recolor_by_qual) {
      FactoryBot.create(
        :api_v3_recolor_by_qual, recolor_by_attribute: recolor_by_attribute
      )
    }
    let(:valid_attributes) {
      FactoryBot.attributes_for(:api_v3_recolor_by_attribute)
    }
    it "clears cache" do
      expect(controller).to receive(:clear_cache_for_regexp)
      put :update, params: {
        context_id: context.id, id: recolor_by_attribute.id, api_v3_recolor_by_attribute: valid_attributes
      }
    end
    it "redirects to index" do
      put :update, params: {
        context_id: context.id, id: recolor_by_attribute.id, api_v3_recolor_by_attribute: valid_attributes
      }
      expect(response).to redirect_to(admin_context_recolor_by_attributes_path(context))
    end
    context "managing download attribute" do
      it "is_downloadable = true" do
        expect_any_instance_of(Api::V3::ManageDownloadAttribute).to receive(:call).with("true", "AAA")
        put :update, params: {
          context_id: context.id,
          id: recolor_by_attribute.id,
          api_v3_recolor_by_attribute: valid_attributes.merge(is_downloadable: "true", download_name: "AAA")
        }
      end
      it "is_downloadable = false" do
        expect_any_instance_of(Api::V3::ManageDownloadAttribute).to receive(:call).with("false", nil)
        put :update, params: {
          context_id: context.id,
          id: recolor_by_attribute.id,
          api_v3_recolor_by_attribute: valid_attributes.merge(is_downloadable: "false")
        }
      end
    end
  end
end
