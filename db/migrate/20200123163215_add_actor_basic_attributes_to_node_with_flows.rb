class AddActorBasicAttributesToNodeWithFlows < ActiveRecord::Migration[5.2]
  def up
    add_column :nodes_with_flows,
      :actor_basic_attributes,
      :json

    unless Rails.env.test? || Rails.env.development?
      Api::V3::Readonly::NodeWithFlows.where(profile: :actor).select(:id).distinct.each do |node|
        NodeWithFlowsRefreshActorBasicAttributesWorker.perform_async(
          [node.id]
        )
      end
    end
  end

  def down
    remove_column :nodes_with_flows, :actor_basic_attributes
  end
end
