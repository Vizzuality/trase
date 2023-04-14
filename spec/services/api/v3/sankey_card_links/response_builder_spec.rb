require "rails_helper"

RSpec.describe Api::V3::SankeyCardLinks::ResponseBuilder do
  include_context "api v3 brazil soy flows"
  include_context "api v3 brazil beef nodes"
  include_context "api v3 brazil soy flow quals"
  include_context "api v3 brazil resize by attributes"
  include_context "api v3 brazil beef context node types"

  before do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  describe :sankey_card_links do
    before do
      @node_type = api_v3_brazil_beef_port_of_export_context_node_type.
        node_type
      @query_params = {
        "commodities" => api_v3_beef.id,
        "countries" => api_v3_brazil.id,
        "selectedResizeBy" => api_v3_volume.readonly_attribute.id,
        "selectedRecolorBy" => api_v3_biome.readonly_attribute.id,
        "selectedYears" => [2015, 2017],
        "selectedBiomeFilterName" => api_v3_biome_node.name,
        "selectedColumnsIds" => "1_#{@node_type.id}",
        "selectedNodesIds" => [
          api_v3_brazil_beef_country_of_production_node.id,
          api_v3_country_of_destination_node.id
        ]
      }
      @sankey_card_link = FactoryBot.create(
        :api_v3_sankey_card_link,
        level1: true,
        link: "http://localhost:8081/flows?#{@query_params.to_query}"
      )

      @builder = Api::V3::SankeyCardLinks::ResponseBuilder.new(levels: [1])
      @builder.call
    end

    it "should return data" do
      data = @builder.data.first
      expect(data[:id]).to eq(@sankey_card_link.id)
      %w[countries commodities selectedRecolorBy
         selectedResizeBy selectedBiomeFilterName selectedYears].each do |attribute|
        expect(data[:queryParams][attribute]).to eq(
          @sankey_card_link.query_params[attribute]
        )
      end
    end

    it "should return meta" do
      nodes = @builder.meta[:nodes]
      expect(nodes.map { |n| n[:id] }).to match_array([
        api_v3_brazil_beef_country_of_production_node.id,
        api_v3_country_of_destination_node.id
      ])
      expect(nodes.map { |n| n[:nodeTypeId] }).to match_array([
        api_v3_brazil_beef_country_of_production_node.node_type_id,
        api_v3_country_of_destination_node.node_type_id
      ])

      column = @builder.meta[:columns].
        find { |_ntid, c| c[:columnGroup] == 1 }.last
      expect(column[:nodeTypeId]).to eq(@node_type.id)
      expect(column[:nodeType]).to eq(@node_type.name)
    end
  end
end
