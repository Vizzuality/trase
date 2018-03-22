require 'rails_helper'

RSpec.describe Api::V3::DownloadController, type: :controller do
  include_context 'api v3 brazil flows'
  include_context 'api v3 paraguay context'

  describe 'GET index' do
    before(:each) do
      Api::V3::Readonly::DownloadFlow.refresh
      Api::V3::DownloadVersion.current_version_symbol(api_v3_context) ||
        FactoryBot.create(
          :api_v3_download_version,
          symbol: 'v1.0',
          is_current: true,
          context_id: api_v3_context.id
        )
    end
    it 'returns a zipped csv file' do
      get :index, params: {context_id: api_v3_context.id}, format: :csv
      expect(assigns(:context)).to eq(api_v3_context)
      expect(response.content_type).to eq('application/zip')
      expect(
        response.headers['Content-Disposition']
      ).to eq('attachment; filename="BRAZIL_SOY_v1.0.zip"')
    end
    it 'returns a zipped json file' do
      get :index, params: {context_id: api_v3_context.id}, format: :json
      expect(assigns(:context)).to eq(api_v3_context)
      expect(response.content_type).to eq('application/zip')
      expect(
        response.headers['Content-Disposition']
      ).to eq('attachment; filename="BRAZIL_SOY_v1.0.zip"')
    end
    it 'returns no version on file name if none is available' do
      get :index, params: {context_id: api_v3_paraguay_context.id}, format: :json
      expect(assigns(:context)).to eq(api_v3_paraguay_context)
      expect(response.content_type).to eq('application/zip')
      expect(
        response.headers['Content-Disposition']
      ).to eq('attachment; filename="PARAGUAY_SOY.zip"')
    end
  end
end
