require "rails_helper"

RSpec.describe Api::V3::Profiles::ProfileMeta do
  include_context "api v3 brazil exporter actor profile"
  include_context "api v3 brazil soy flow quants"

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
  end

  let(:bunge_exporter){ api_v3_exporter2_node }
  let(:bunge_importer){ api_v3_importer2_node }
  let(:node_with_flows) {
    Api::V3::Readonly::NodeWithFlows.find_by(
      id: bunge_exporter.id, context_id: api_v3_brazil_soy_context.id
    )
  }
  let(:profile_meta) do
    Api::V3::Profiles::ProfileMeta.new(
      node_with_flows, api_v3_brazil_soy_context
    )
  end

  describe "activities" do
    it "includes BUNGE importer" do
      expect(profile_meta.activities).to include(
        {
          id: bunge_importer.id,
          name: :importer
        }
      )
    end
  end
end