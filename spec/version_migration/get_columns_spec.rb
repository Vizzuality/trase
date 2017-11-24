require 'rails_helper'

RSpec.describe 'Get columns', type: :request do
  # include_context 'brazil soy indicators'
  # include_context 'brazil resize by'
  # include_context 'brazil recolor by'

  # include_context 'brazil context nodes'

  include_context 'brazil contexts'

  describe 'GET /api/v2/get_columns === GET /api/v3/columns ' do
    it 'has the correct response structure' do
      SchemaRevamp.new.copy

      get "/api/v2/get_columns?context_id=#{context.id}"
      v2_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(@response.status).to eq 200

      get "/api/v3/columns?context_id=#{context.id}"
      expect(@response.status).to eq 200
      v3_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(v3_response).to eq v2_response
    end
  end
end
