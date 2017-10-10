require 'rails_helper'

RSpec.describe DownloadController, type: :controller do
  include_context "two flows"
  include_context "paraguay context"

  describe "GET index" do
    before(:each) do
      MaterializedFlow.refresh
      FactoryGirl.create(:download_version, symbol: 'v1.0', current: true, context_id: context.id)
    end
    it "returns a zipped csv file" do
      get :index, params: { context_id: context.id }, format: :csv
      expect(assigns(:context)).to eq(context)
      expect(response.content_type).to eq("application/zip")
      expect(response.headers["Content-Disposition"]).to eq('attachment; filename="BRAZIL_SOY_v1.0.zip"')
    end
    it "returns a zipped json file" do
      get :index, params: { context_id: context.id }, format: :json
      expect(assigns(:context)).to eq(context)
      expect(response.content_type).to eq("application/zip")
      expect(response.headers["Content-Disposition"]).to eq('attachment; filename="BRAZIL_SOY_v1.0.zip"')
    end
    it "returns no version on file name if none is available" do
      get :index, params: { context_id: paraguay_context.id }, format: :json
      expect(assigns(:context)).to eq(paraguay_context)
      expect(response.content_type).to eq("application/zip")
      expect(response.headers["Content-Disposition"]).to eq('attachment; filename="PARAGUAY_SOY.zip"')
    end
  end
end
