class AddIdsToNodesWithFlows < ActiveRecord::Migration[5.2]
  def change
    update_view :nodes_with_flows_v,
      version: 2,
      revert_to_version: 1,
      materialized: false

    execute 'ALTER table nodes_with_flows DROP CONSTRAINT nodes_with_flows_pkey'
    rename_table :nodes_with_flows, :nodes_with_flows_cp


    create_table :nodes_with_flows, primary_key: %i[id context_id] do |t|
      t.integer :id
      t.integer :context_id
      t.integer :country_id
      t.integer :commodity_id
      t.integer :node_type_id
      t.integer :context_node_type_id
      t.integer :main_id
      t.column :column_position, 'smallint'
      t.boolean :is_subnational
      t.boolean :is_unknown
      t.boolean :is_domestic_consumption
      t.text :name
      t.text :node_type
      t.text :profile
      t.text :geo_id
      t.text :role
      t.column :name_tsvector, 'tsvector'
      t.column :years, 'smallint[]'
      t.json :actor_basic_attributes
    end

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
