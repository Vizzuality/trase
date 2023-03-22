require "rails_helper"

RSpec.describe Admin::DatabaseUpdateController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  describe "GET index" do
    it "redirects when data update not supported" do
      allow(controller).to receive(:data_update_supported?).and_return(false)
      get :index
      expect(response).to redirect_to(admin_root_url)
    end
  end
end
