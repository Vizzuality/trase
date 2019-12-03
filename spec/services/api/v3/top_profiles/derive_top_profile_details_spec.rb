require 'rails_helper'

RSpec.describe Api::V3::TopProfiles::DeriveTopProfileDetails do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil exporter actor profile'

  describe :call do
    before(:each) do
      Api::V3::Readonly::FlowNode.refresh(sync: true)
      Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
      Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
      Api::V3::Readonly::ChartAttribute.refresh(sync: true, skip_dependencies: true)
    end

    let!(:top_profile) { FactoryBot.create(:api_v3_top_profile, context: api_v3_context, node: api_v3_exporter1_node) }
    let!(:subject) { Api::V3::TopProfiles::DeriveTopProfileDetails.call(top_profile) }

    it 'assigns profile type to top profile record' do
      expect(
        top_profile.profile_type
      ).to eq(Api::V3::Readonly::NodeWithFlows.find(api_v3_exporter1_node.id).profile)
    end

    it 'assigns year to top profile record' do
      expect(
        top_profile.year
      ).to eq(Api::V3::Readonly::NodeWithFlows.find(api_v3_exporter1_node.id).years.max)
    end

    it 'assigns summary to top profile record' do
      expect(
        top_profile.summary
      ).not_to be_nil
    end
  end
end
