require "rails_helper"

RSpec.describe Admin::ContextsController, type: :controller do
  let(:user) { FactoryBot.create(:user) }
  before { sign_in user }
  describe "GET index" do
    it "returns 200" do
      get :index
      expect(response).to be_successful
    end
  end
end
