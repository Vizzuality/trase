require 'rails_helper'

RSpec.describe Api::Public::Node::Filter do
  include_context 'api v3 quants'
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::Context.refresh(sync: true)
    Api::V3::Readonly::Node.refresh(sync: true)
    Api::V3::Readonly::FlowNode.refresh(sync: true)
  end

  context 'when filtering by node_id and year' do
    it 'should return flow attributes for that country' do
      builder = Api::Public::Node::Filter.new(
        id: api_v3_biome_node.id,
        year: 2015
      )
      query = builder.call
      attrs = query.attributes

      node = api_v3_biome_node.readonly_attribute
      expect(attrs['node_id']).to eql(api_v3_biome_node.id)
      expect(attrs['name']).to eql(node.name)
      expect(attrs['node_type']).to eql(node.node_type)
      expect(attrs['geo_id']).to eql(node.geo_id)

      expect(attrs['availability'].first['country']).to eql(node.context.country.iso2)
      expect(attrs['availability'].first['commodity']).to eql(node.context.commodity_name)
      expect(attrs['availability'].first['years']).to eql(node.years)
      
      flows_ids = attrs['flow_indicators'].map { |fi| fi['flow_id'] }
      expect(flows_ids).to eql(
        Api::V3::Readonly::FlowNode.where(node_id: node.id).map(&:flow_id)
      )
      flow_quants_values = attrs['flow_indicators'].
        map { |fi| fi['flow_quants'] }.
        flatten.
        map { |fq| fq['value'] }
      expect(flow_quants_values).to match_array(
        Api::V3::FlowQuant.where(flow_id: flows_ids).map(&:value).map(&:to_i)
      )
    end
  end
end
