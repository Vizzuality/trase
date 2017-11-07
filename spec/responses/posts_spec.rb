require 'rails_helper'

RSpec.describe 'Get posts', type: :request do
  include_context 'posts'

  describe 'GET /api/v2/posts' do
    it 'has the correct response structure' do
      get '/api/v2/posts'

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('posts')
    end
  end
end
