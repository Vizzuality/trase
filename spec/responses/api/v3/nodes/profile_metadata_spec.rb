require 'rails_helper'

RSpec.describe 'Profile metadata', type: :request do
  let(:context) { FactoryBot.create(:api_v3_context) }
  let(:node) { FactoryBot.create(:api_v3_node) }
  describe 'GET /api/v3/contexts/:context_id/nodes/:node_id/profile_metadata' do
    it 'redirects to profiles/:node_id/profile_meta?context_id=:context_id' do
      get "/api/v3/contexts/#{context.id}/nodes/#{node.id}/profile_metadata"
      expect(@response).to redirect_to(
        "/api/v3/profiles/#{node.id}/profile_meta?context_id=#{context.id}"
      )
    end
  end
end
