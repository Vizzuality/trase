require 'rails_helper'

RSpec.describe 'Linked nodes', type: :request do
  include_context 'api v3 brazil soy nodes'
  include_context 'api v3 brazil soy flows'

  describe 'GET /api/v3/contexts/:context_id/linked_nodes' do
    it 'has the correct response structure' do
      query_params = "target_column_id=#{api_v3_municipality_node_type.id}&years[]=2015&nodes_ids[]=#{api_v3_exporter1_node.id}"
      get "/api/v3/contexts/#{api_v3_brazil_soy_context.id}/linked_nodes?#{query_params}"

      expect(@response).to have_http_status(:ok)
      expect(@response).to match_response_schema('get_linked_geo_ids')
    end
  end
end
