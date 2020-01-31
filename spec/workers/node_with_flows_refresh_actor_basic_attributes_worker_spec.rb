require 'rails_helper'

RSpec.describe NodeWithFlowsRefreshActorBasicAttributesWorker, type: :worker do
  Sidekiq::Testing.inline!

  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil exporter actor profile'

  let(:node) { api_v3_exporter1_node }
  let(:year) { 2015 }

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::ChartAttribute.refresh(sync: true, skip_dependencies: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true, skip_dependencies: true)
  end

  it 'update actor basic attributes column' do
    valid_node_with_flows = Api::V3::Readonly::NodeWithFlows.all.select do |nodes|
      nodes.send('can_update_actor_basic_attributes?')
    end

    valid_node_with_flows.each do |node_with_flows|
      expect(node_with_flows.actor_basic_attributes).to be_nil
    end

    NodeWithFlowsRefreshActorBasicAttributesWorker.new.perform(
      valid_node_with_flows.map(&:id)
    )

    valid_node_with_flows.each do |node_with_flows|
      node_with_flows.reload
      expect(node_with_flows.actor_basic_attributes).not_to be_nil
    end
  end
end
