require 'rails_helper'

RSpec.describe 'Get contexts', type: :request do
  include_context 'api v3 brazil soy nodes'
  include_context 'api v3 brazil download attributes'
  include_context 'api v3 brazil resize by'
  include_context 'api v3 brazil recolor by'

  describe 'GET /api/v3/contexts' do
    before(:each) do
      SchemaRevamp.new.refresh
    end

    it 'has the correct response structure' do
      get '/api/v3/contexts'

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('contexts_v3')
    end
  end
end
