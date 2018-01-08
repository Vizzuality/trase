require 'rails_helper'

RSpec.describe 'Columns', type: :request do
  include_context 'api v3 brazil soy indicators'
  include_context 'api v3 brazil context nodes'

  describe 'GET /api/v3/contexts/:context_id/columns' do
    it 'has the correct response structure' do
      get "/api/v3/contexts/#{api_v3_context.id}/columns"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('columns')
    end
  end
end
