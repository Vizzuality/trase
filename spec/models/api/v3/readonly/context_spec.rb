require "rails_helper"

RSpec.describe Api::V3::Readonly::Context, type: :model do
  include_context "api v3 brazil soy flows"

  describe :biome_nodes do
    context "when context without biomes" do
      include_context "api v3 brazil beef flows"

      before(:each) do
        Api::V3::Readonly::FlowNode.refresh(sync: true)
        Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
        Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
      end

      let(:context) { api_v3_brazil_beef_context.readonly_context }

      it "returns empty array" do
        expect(context.biome_nodes.map(&:id)).to eq([])
      end
    end

    context "when context with biomes" do
      include_context "api v3 paraguay flows"

      before(:each) do
        Api::V3::Readonly::FlowNode.refresh(sync: true)
        Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
        Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
      end

      let(:context) { api_v3_paraguay_context.readonly_context }

      it "returns biome nodes" do
        expect(context.biome_nodes.map(&:id)).to eq([api_v3_paraguay_biome_node.id])
      end
    end
  end
end
