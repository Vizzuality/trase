require 'rails_helper'

RSpec.describe Api::V3::TopProfilesController, type: :request do
  let!(:top_profile) { FactoryBot.create(:api_v3_top_profile) }
  let!(:top_profile_2) { FactoryBot.create(:api_v3_top_profile) }

  describe 'GET index' do
    it 'returns all the top profiles if context id not provided' do
      get '/api/v3/top_profiles'

      expect(response).to have_http_status(:ok)
      expect(response.body).to include(top_profile.context_id.to_s)
      expect(response.body).to include(top_profile_2.context_id.to_s)
    end

    it 'returns top profiles for this context id' do
      get "/api/v3/top_profiles?context_id=#{top_profile_2.context_id}"

      expect(response).to have_http_status(:ok)
      expect(response.body).to include(top_profile_2.context_id.to_s)
      expect(response.body).not_to include(top_profile.context_id.to_s)
    end
  end
end
