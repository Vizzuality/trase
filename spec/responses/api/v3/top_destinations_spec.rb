require 'rails_helper'

RSpec.describe 'Top destinations', type: :request do
  include_context 'api v3 brazil flows quants'

  describe 'GET /api/v3/top_destinations' do
    context 'when a list of context is specified' do
      it 'returns the top destinations for those contexts' do
        get '/api/v3/top_destinations', params: {
          start_year: 2003,
          end_year: 2019,
          contexts_ids: [api_v3_context.id]
        }

        expect(@response).to have_http_status(:ok)
        expect(@response).to match_response_schema('v3_top_destinations')

        parsed_response = JSON.parse(@response.body)
        top_destinations_ids = parsed_response['data']['targetDestinations'].map { |d| d['id'] }
        expect(top_destinations_ids).to eql([
          api_v3_country_of_destination1_node.id,
          api_v3_other_country_of_destination_node.id
        ])
      end
    end

    context 'when a commodity is specified' do
      it 'returns the top destinations for the specified commodity' do
        get '/api/v3/top_destinations', params: {
          start_year: 2003,
          end_year: 2019,
          commodity_id: api_v3_soy.id
        }

        expect(@response).to have_http_status(:ok)
        expect(@response).to match_response_schema('v3_top_destinations')

        parsed_response = JSON.parse(@response.body)
        top_destinations_ids = parsed_response['data']['targetDestinations'].map { |d| d['id'] }
        expect(top_destinations_ids).to eql([
          api_v3_country_of_destination1_node.id,
          api_v3_other_country_of_destination_node.id
        ])
      end
    end
  end
end
