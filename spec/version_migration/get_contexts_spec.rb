require 'rails_helper'


class Hash
  def sort_by_key(recursive = false, &block)
    self.keys.sort(&block).reduce({}) do |seed, key|
      seed[key] = self[key]
      if seed[key].is_a?(Array)
        seed[key].sort { |a,b| a.is_a?(Hash) && a['id'] || a <=> b.is_a?(Hash) && b['id'] }
      end
      if recursive && seed[key].is_a?(Hash)
        seed[key] = seed[key].sort_by_key(true, &block)
      end
      seed
    end
  end
end

RSpec.describe 'Get contexts', type: :request do
  include_context 'brazil soy indicators'
  include_context 'brazil resize by'
  include_context 'brazil recolor by'

  describe 'GET /api/v2/get_contexts === GET /api/v3/get_contexts ' do
    it 'has the correct response structure' do
      get '/api/v2/get_contexts'
      v2_response = JSON.parse(@response.body)
      expect(@response.status).to eq 200

      get '/api/v3/get_contexts'
      expect(@response.status).to eq 200

      v3_response = JSON.parse(@response.body).sort_by_key(true)
      expect(v3_response).to eq v2_response
    end
  end
end
