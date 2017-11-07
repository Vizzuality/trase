require 'rails_helper'

RSpec.describe 'Get a site dive', type: :request do
  include_context 'site dives'

  describe 'GET /site dive' do
    it 'requires a site dive id' do
      expect { get '/content/site_dive' }.to raise_error(ActionController::RoutingError)
    end

    it 'returns 404 on non-existent context_id' do
      expect { get "/content/site_dive/#{site_dive_1.id + 1}" }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'has the correct response structure' do
      get "/content/site_dive/#{site_dive_1.id}"

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('site_dive')
    end
  end
end
