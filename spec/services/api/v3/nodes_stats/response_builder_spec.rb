require 'rails_helper'

RSpec.describe Api::V3::NodesStats::ResponseBuilder do
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::NodesStats.refresh
  end

  describe :nodes_stats do
    it 'should return top countries' do
      builder = Api::V3::NodesStats::ResponseBuilder.new(
        nil,
        [api_v3_context.id],
        node_type_id: api_v3_country_node_type.id,
        attribute_ids: [api_v3_volume.id],
        year_start: 2015,
        year_end: 2015
      )

      builder.call

      expect(builder.nodes_stats.first['node_id']).to eq(
        api_v3_country_of_destination1_node.id
      )
    end
  end
end
