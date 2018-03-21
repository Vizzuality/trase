require 'rails_helper'

RSpec.describe 'Download Attributes', type: :request do
  before do
    Api::V3::DownloadAttribute.skip_callback(:commit, :after, :refresh_dependencies)
  end
  after do
    Api::V3::DownloadAttribute.set_callback(:commit, :after, :refresh_dependencies)
  end
  include_context 'api v3 brazil download attributes'
  include_context 'api v3 brazil municipality qual values'
  include_context 'api v3 brazil municipality quant values'

  describe 'GET /api/v3/contexts/:context_id/download_attributes' do
    before(:each) do
      Api::V3::Readonly::Attribute.refresh
      Api::V3::Readonly::DownloadAttribute.refresh
      ActiveRecord::Base.connection.execute('COMMIT') # TODO: make default conn
    end

    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/download_attributes"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('indicators')
    end
  end
end
