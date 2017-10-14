require 'rails_helper'

RSpec.describe 'Get contexts', type: :request do
  include_context 'brazil soy indicators'
  include_context 'brazil resize by'
  include_context 'brazil recolor by'

  describe 'GET /get_contexts' do
    it 'has the correct response structure' do
      get '/get_contexts'

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema("contexts")
    end
  end
end
