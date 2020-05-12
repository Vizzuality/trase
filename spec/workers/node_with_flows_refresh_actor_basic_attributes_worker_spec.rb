require 'rails_helper'

RSpec.describe NodeWithFlowsRefreshActorBasicAttributesWorker, type: :worker do
  Sidekiq::Testing.inline!

  include_context 'api v3 brazil soy flows'
  include_context 'api v3 brazil exporter actor profile'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
  end

  it 'update actor basic attributes column' do
    actor_with_flows = Api::V3::Readonly::NodeWithFlows.
      where(context_id: api_v3_brazil_soy_context.id, profile: 'actor').
      find(api_v3_exporter1_node.id)
    expect(actor_with_flows.actor_basic_attributes).to be_nil

    NodeWithFlowsRefreshActorBasicAttributesWorker.new.perform(
      [api_v3_exporter1_node.id]
    )

    actor_with_flows.reload
    expect(actor_with_flows.actor_basic_attributes).not_to be_nil
  end
end
