require 'rails_helper'

RSpec.describe Api::V3::NodeTypesController, type: :controller do
  include_context 'api v3 brazil soy nodes'

  describe 'GET index' do
    it 'returns biome with filter_to municipality' do
      get :index, params: {context_id: api_v3_context.id}
      parsed_response = JSON.parse(response.body)
      node_types = parsed_response['data']
      biome = node_types.find { |nt| nt['id'] == api_v3_biome_node_type.id }
      expect(biome['filterTo']).to eq(api_v3_municipality_node_type.id)
    end

    it 'returns exporter with filter_to null' do
      get :index, params: {context_id: api_v3_context.id}
      parsed_response = JSON.parse(response.body)
      node_types = parsed_response['data']
      exporter = node_types.find do |nt|
        nt['id'] == api_v3_exporter_node_type.id
      end
      expect(exporter['filterTo']).to be_nil
    end
  end
end
