require 'rails_helper'

RSpec.describe DownloadController, type: :controller do
  include_context "two flows"
  describe "GET index" do
    it "returns a csv file" do
      get :index, params: { country: 'BRAZIL', commodity: 'SOY' }, format: :csv
      expect(assigns(:context)).to eq(context)
      expect(response.content_type).to eq("text/csv")
      expect(response.headers["Content-Disposition"]).to eq("attachment; filename=BRAZIL_SOY.csv")
    end
  end
end
