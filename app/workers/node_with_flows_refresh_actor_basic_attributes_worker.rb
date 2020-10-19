class NodeWithFlowsRefreshActorBasicAttributesWorker
  include Sidekiq::Worker

  sidekiq_options queue: :default,
                  retry: 0,
                  backtrace: true,
                  unique: :until_executed,
                  run_lock_expiration: 60 * 60 * 2, # 2 hrs
                  log_duplicate_payload: true

  def perform(node_with_flows_ids = [])
    Api::V3::Readonly::NodeWithFlows.
      where(id: node_with_flows_ids).
      each(&:refresh_actor_basic_attributes)
  end
end
