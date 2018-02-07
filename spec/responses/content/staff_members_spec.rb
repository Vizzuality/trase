require 'rails_helper'

RSpec.describe 'Get staff members', type: :request do
  include_context 'staff members'

  describe 'GET /content/staff_members' do
    it 'has the correct response structure' do
      get '/content/staff_members'

      expect(@response.status).to eq 200
      expect(@response).to match_response_schema('staff_members')
    end
  end
end
