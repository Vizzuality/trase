require "rails_helper"

RSpec.describe Api::V3::TopNodes::ResponseBuilder do
  include_context "api v3 brazil soy flow quants"

  before(:each) {
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
    Api::V3::TablePartitions::CreatePartitionsForFlowQuants.new.call
  }

  describe :top_nodes do
    it "should return top exporters" do
      builder = Api::V3::TopNodes::ResponseBuilder.new(
        api_v3_brazil_soy_context,
        node_type_id: api_v3_exporter_node_type.id,
        year_start: 2015,
        year_end: 2015
      )

      builder.call

      expect(builder.top_nodes.first["node_id"]).to eq(api_v3_exporter1_node.id)
    end

    it "should return top countries" do
      builder = Api::V3::TopNodes::ResponseBuilder.new(
        api_v3_brazil_soy_context,
        node_type_id: api_v3_country_node_type.id,
        year_start: 2015,
        year_end: 2015
      )

      builder.call

      expect(builder.top_nodes.first["node_id"]).to eq(api_v3_country_of_destination1_node.id)
    end
  end
end
