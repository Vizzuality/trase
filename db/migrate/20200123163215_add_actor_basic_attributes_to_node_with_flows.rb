class AddActorBasicAttributesToNodeWithFlows < ActiveRecord::Migration[5.2]
  def up
    add_column :nodes_with_flows,
      :actor_basic_attributes,
      :json

    Api::V3::Readonly::NodeWithFlows.where(profile: :actor).each do |node_with_flows|
      node_with_flows.refresh_actor_basic_attributes
    end
  end

  def down
    remove_column :nodes_with_flows, :actor_basic_attributes
  end
end
