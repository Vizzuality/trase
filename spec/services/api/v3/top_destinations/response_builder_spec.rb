require 'rails_helper'

RSpec.describe Api::V3::TopDestinations::ResponseBuilder do
  include_context 'api v3 brazil flows quants'

  describe :top_destinations do
    it 'should return top countries' do
      builder = Api::V3::TopDestinations::ResponseBuilder.new(
        nil,
        [api_v3_context.id],
        year_start: 2015,
        year_end: 2015
      )

      builder.call

      expect(builder.top_destinations.first['node_id']).to eq(
        api_v3_country_of_destination1_node.id
      )
    end
  end
end
