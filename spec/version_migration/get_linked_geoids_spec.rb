require 'rails_helper'

RSpec.describe 'Get linked geoids', type: :request do
  include_context 'brazil soy nodes'
  include_context 'brazil flows'

  describe 'GET /api/v2/get_linked_geoids === GET /api/v3/contexts/:id/linked_nodes ' do
    it 'has the correct response structure' do
      SchemaRevamp.new.copy
      query_params = "target_column_id=#{municipality_node_type.id}&years[]=2015&nodes_ids[]=#{exporter1_node.id}"

      get "/api/v2/get_linked_geoids?context_id=#{context.id}&#{query_params}"
      v2_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(@response.status).to eq 200

      get "/api/v3/contexts/#{context.id}/linked_nodes?#{query_params}"
      expect(@response.status).to eq 200
      v3_response = HashSorter.new(JSON.parse(@response.body)).sort

      expect(v3_response).to eq v2_response
    end
  end
end
