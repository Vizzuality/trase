require 'rails_helper'

RSpec.describe DownloadController, type: :controller do
  include_context "two flows"
  describe "GET index" do
    before(:each) do
      MaterializedFlow.refresh
      FactoryGirl.create(:download_version, symbol: 'v1.0', current: true)
    end
    it "returns a csv file" do
      get :index, params: { context_id: context.id }, format: :csv
      expect(assigns(:context)).to eq(context)
      expect(response.content_type).to eq("text/csv")
      expect(response.headers["Content-Disposition"]).to eq("attachment; filename=BRAZIL_SOY_v1.0.csv")
    end
    it "returns a csv file with pivot" do
      get :index, params: { context_id: context.id, pivot: 1 }, format: :csv
      expect(assigns(:context)).to eq(context)
      expect(response.content_type).to eq("text/csv")
      expect(response.headers["Content-Disposition"]).to eq("attachment; filename=BRAZIL_SOY_v1.0.csv")
    end
    it "returns a semicolon-delimited csv file" do
      get :index, params: { context_id: context.id, separator: :semicolon}, format: :csv
      expect(assigns(:context)).to eq(context)
      expect(response.content_type).to eq("text/csv")
      expect(response.headers["Content-Disposition"]).to eq("attachment; filename=BRAZIL_SOY_v1.0.csv")
    end
    it "returns a json file" do
      get :index, params: { context_id: context.id }, format: :json
      expect(assigns(:context)).to eq(context)
      expect(response.content_type).to eq("text/json")
      expect(response.headers["Content-Disposition"]).to eq("attachment; filename=BRAZIL_SOY_v1.0.json")
    end
  end
end
