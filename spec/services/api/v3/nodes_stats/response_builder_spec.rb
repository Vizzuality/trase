require 'rails_helper'

RSpec.describe Api::V3::NodesStats::ResponseBuilder do
  include_context 'api v3 brazil flows quals'
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::Attribute.refresh
    Api::V3::Readonly::NodesStats.refresh
  end

  describe :nodes_stats do
    context 'when all options are correct' do
      it 'should return top countries' do
        builder = Api::V3::NodesStats::ResponseBuilder.new(
          nil,
          [api_v3_context.id],
          node_type_id: api_v3_country_node_type.id,
          attribute_id: api_v3_volume.readonly_attribute.id,
          other_attributes_ids: [],
          year_start: 2015,
          year_end: 2015
        )

        builder.call

        expect(builder.nodes_stats.first['node_id']).to eq(
          api_v3_country_of_destination1_node.id
        )
      end
    end

    context 'when start_year is greather than end_year' do
      it 'raise an error' do
        expect {
          Api::V3::NodesStats::ResponseBuilder.new(
            nil,
            [api_v3_context.id],
            node_type_id: api_v3_country_node_type.id,
            attribute_id: api_v3_volume.readonly_attribute.id,
            other_attributes_ids: [],
            year_start: 2016,
            year_end: 2015
          )
        }.to raise_error(
          'Year start can not be higher than year end'
        )
      end
    end

    context 'when commodity and contexts are specified' do
      it 'raise an error' do
        expect {
          Api::V3::NodesStats::ResponseBuilder.new(
            api_v3_soy.id,
            [api_v3_context.id],
            node_type_id: api_v3_country_node_type.id,
            attribute_id: api_v3_volume.readonly_attribute.id,
            other_attributes_ids: [],
            year_start: 2015,
            year_end: 2015
          )
        }.to raise_error(
          'Either commodity or contexts but not both'
        )
      end
    end

    context 'when a qual or ind is used as attribute_id' do
      it 'raise an error' do
        expect {
          Api::V3::NodesStats::ResponseBuilder.new(
            nil,
            [api_v3_context.id],
            node_type_id: api_v3_country_node_type.id,
            attribute_id: api_v3_biome.readonly_attribute.id,
            year_start: 2015,
            year_end: 2015
          )
        }.to raise_error(
          "Attribute #{api_v3_biome.readonly_attribute.id} not found"
        )
      end
    end

    context 'when a qual or ind is used as other_attributes_ids' do
      it 'raise an error' do
        expect {
          Api::V3::NodesStats::ResponseBuilder.new(
            nil,
            [api_v3_context.id],
            node_type_id: api_v3_country_node_type.id,
            attribute_id: api_v3_volume.readonly_attribute.id,
            other_attributes_ids: [api_v3_biome.readonly_attribute.id],
            year_start: 2015,
            year_end: 2015
          )
        }.to raise_error(
          "Attribute #{api_v3_biome.readonly_attribute.id} not found"
        )
      end
    end
  end
end
