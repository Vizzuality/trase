require 'rails_helper'

RSpec.describe 'Get contexts', type: :request do
  before do
    Api::V3::DownloadAttribute.skip_callback(:commit, :after, :refresh_dependencies)
    Api::V3::ResizeByAttribute.skip_callback(:commit, :after, :refresh_dependencies)
    Api::V3::RecolorByAttribute.skip_callback(:commit, :after, :refresh_dependencies)
  end
  after do
    Api::V3::DownloadAttribute.set_callback(:commit, :after, :refresh_dependencies)
    Api::V3::ResizeByAttribute.set_callback(:commit, :after, :refresh_dependencies)
    Api::V3::RecolorByAttribute.set_callback(:commit, :after, :refresh_dependencies)
  end
  include_context 'api v3 brazil soy nodes'
  include_context 'api v3 brazil download attributes'
  include_context 'api v3 brazil resize by attributes'
  include_context 'api v3 brazil recolor by attributes'

  describe 'GET /api/v3/contexts' do
    before(:each) do
      Api::V3::Readonly::Attribute.refresh
      Api::V3::Readonly::DownloadAttribute.refresh
      Api::V3::Readonly::ResizeByAttribute.refresh
      Api::V3::Readonly::RecolorByAttribute.refresh
      ActiveRecord::Base.connection.execute('COMMIT') # TODO: make default conn
    end

    it 'has the correct response structure' do
      get '/api/v3/contexts'

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('v3_contexts')
    end
  end
end
