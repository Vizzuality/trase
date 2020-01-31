class AddActorBasicAttributesToNodeWithFlows < ActiveRecord::Migration[5.2]
  def change
    add_column :nodes_with_flows,
      :actor_basic_attributes,
      :json

    Api::V3::Readonly::NodeWithFlows.all.each do |node_with_flows|
      node_with_flows.set(actor_basic_attributes: actor_basic_attributes)
    end
  end
end
