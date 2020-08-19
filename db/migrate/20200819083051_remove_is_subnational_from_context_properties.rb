class RemoveIsSubnationalFromContextProperties < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        update_view :nodes_with_flows_v,
          version: 3,
          revert_to_version: 2,
          materialized: false

        refresh_nodes_with_flows
      end

      dir.down do |dir|
        update_view :nodes_with_flows_v,
          version: 2,
          revert_to_version: 3,
          materialized: false

        refresh_nodes_with_flows
      end
    end

    remove_column :context_properties, :is_subnational, :boolean
  end

  def refresh_nodes_with_flows
    execute 'CREATE table nodes_with_flows_cp AS SELECT * FROM nodes_with_flows'

    Api::V3::Readonly::NodeWithFlows.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )

    execute (
      'UPDATE nodes_with_flows
      SET actor_basic_attributes = nodes_with_flows_cp.actor_basic_attributes
      FROM nodes_with_flows_cp
      WHERE nodes_with_flows_cp.id = nodes_with_flows.id
      AND nodes_with_flows_cp.context_id = nodes_with_flows.context_id'
    )

    drop_table :nodes_with_flows_cp
  end
end
