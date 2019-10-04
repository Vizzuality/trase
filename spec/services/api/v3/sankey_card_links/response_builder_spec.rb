require 'rails_helper'

RSpec.describe Api::V3::SankeyCardLinks::ResponseBuilder do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil beef nodes'
  include_context 'api v3 brazil flows quals'
  include_context 'api v3 brazil resize by attributes'
  include_context 'api v3 brazil beef context node types'

  before do
    Api::V3::Readonly::Node.refresh(sync: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  describe :sankey_card_links do
    before do
      @node_type_id = api_v3_brazil_beef_port_of_export_context_node_type.
        node_type_id
      @sankey_card_link = FactoryBot.create :api_v3_sankey_card_link, level: 1,query_params: {
        'selectedCommodityId' => api_v3_beef.id,
        'selectedCountryId' => api_v3_brazil.id,
        'selectedResizeBy' => api_v3_volume.readonly_attribute.id,
        'selectedRecolorBy' => api_v3_biome.readonly_attribute.id,
        'selectedYears' => [2015, 2017],
        'selectedBiomeFilterName' => api_v3_biome_node.name,
        'selectedColumnsIds' => "1_#{@node_type_id}",
        'selectedNodesIds' => [api_v3_brazil_beef_country_of_production_node.id,
                               api_v3_country_of_destination_node.id]
      }

      @builder = Api::V3::SankeyCardLinks::ResponseBuilder.new(level: 1)
      @builder.call
    end

    it 'should return data' do
      data = @builder.data.first
      expect(data[:id]).to eq(@sankey_card_link.id)
      expect(data[:host]).to eq(@sankey_card_link.host)
      expect(data[:query_params]).to eq(@sankey_card_link.query_params)
      expect(data[:link]).to eq(@sankey_card_link.link)
    end

    it 'should return meta' do
      nodes = @builder.meta[:nodes]
      expect(nodes.map { |n| n[:id] }).to eql([
        api_v3_brazil_beef_country_of_production_node.id,
        api_v3_country_of_destination_node.id
      ])
      expect(nodes.map { |n| n[:node_type] }).to eql([
        api_v3_brazil_beef_country_of_production_node.node_type.name,
        api_v3_country_of_destination_node.node_type.name
      ])

      column = @builder.meta[:columns].find { |c| c[:column_group] == 1 }
      pp column
      pp @node_type_id
      expect(column[:node_type_id]).to eq(@node_type_id)
    end
  end
end
