require 'rails_helper'

RSpec.describe 'Get place node attributes', type: :request do
  include_context 'brazil quant values'

  describe 'GET /get_place_node_attributes' do
    it 'requires a context_id' do
      get '/get_place_node_attributes'

      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq({'error' => 'param is missing or the value is empty: Required context_id missing'})
    end

    it 'requires a node_id' do
      get '/get_place_node_attributes', params: {:context_id => context.id }

      expect(@response.status).to eq 500
      expect(JSON.parse(@response.body)).to eq({'error' => 'param is missing or the value is empty: Required node_id missing'})
    end

    it 'validates node types' do
      expect { get '/get_place_node_attributes', params: {:context_id => context.id, :node_id => country_of_destination1_node.id } }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get '/get_place_node_attributes', params: {:context_id => context.id, :node_id => exporter1_node.id } }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get '/get_place_node_attributes', params: {:context_id => context.id, :node_id => importer1_node.id } }.to raise_error(ActiveRecord::RecordNotFound)
      expect { get '/get_place_node_attributes', params: {:context_id => context.id, :node_id => port1_node.id } }.to raise_error(ActiveRecord::RecordNotFound)

      expect { get '/get_place_node_attributes', params: {:context_id => context.id, :node_id => municipality_node.id } }.to_not raise_error()
      expect { get '/get_place_node_attributes', params: {:context_id => context.id, :node_id => logistics_hub_node.id } }.to_not raise_error()
      expect { get '/get_place_node_attributes', params: {:context_id => context.id, :node_id => biome_node.id } }.to_not raise_error()
      expect { get '/get_place_node_attributes', params: {:context_id => context.id, :node_id => state_node.id } }.to_not raise_error()
    end

    it 'returns 404 on non-existent context_id' do
      expect { get '/get_place_node_attributes', params: {:context_id => context.id - 100} }.to raise_error(ActiveRecord::RecordNotFound)
    end

    # it 'has the correct response structure' do
    #   get '/get_place_node_attributes', params: {:context_id => context.id, :node_id => municipality_node.id}
    #
    #   expect(@response.status).to eq 200
    #   expect(@response).to match_response_schema("place_profile")
    # end
  end
end
