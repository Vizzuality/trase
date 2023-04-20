require "rails_helper"

RSpec.describe Api::Public::Nodes::Destinations::Filter do
  include_context "api v3 brazil soy flows"
  include_context "api v3 brazil beef flows"

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
  end

  describe :call do
    context "when filtering by country" do
      let(:filter) {
        Api::Public::Nodes::Destinations::Filter.new(
          commodity_id: api_v3_soy.id
        )
      }
      it "returns nodes with availability by commodity" do
        nodes = filter.call
        ru = nodes.find do |n|
          n[:id] == api_v3_country_of_first_import_node_ru.id
        end
        expect(ru[:availability]).not_to be_empty
      end
    end
    context "when filtering by name" do
      let(:filter) {
        Api::Public::Nodes::Destinations::Filter.new(
          name: "FE"
        )
      }

      it "matches on any word" do
        nodes = filter.call
        ru_idx = nodes.index do |n|
          n[:id] == api_v3_country_of_first_import_node_ru.id
        end

        expect(ru_idx).not_to be_nil
      end
    end
  end
end
