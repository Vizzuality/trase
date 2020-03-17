require 'rails_helper'

RSpec.describe 'FilterMeta', type: :request do
  describe 'GET /api/v3/profiles/filter_meta' do
    it 'has the correct response structure' do
      get '/api/v3/profiles/filter_meta'

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('profiles_filter_meta')
    end
  end
end
