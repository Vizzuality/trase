class NodeWithFlowsRefreshActorBasicAttributesWorker
  include Sidekiq::Worker

  sidekiq_options queue: :default,
                  retry: 0,
                  backtrace: true

  def perform(node_id, context_id)
    node_with_flows = Api::V3::Readonly::NodeWithFlows.
      without_unknowns.
      without_domestic.
      find_by(
        id: node_id, context_id: context_id
      )
    return unless node_with_flows

    node_with_flows.refresh_actor_basic_attributes
  end
end
