class CreateNodesWithFlows < ActiveRecord::Migration[5.2]
  def up
    create_view :nodes_with_flows_v, materialized: false
    create_table :nodes_with_flows, primary_key: %i[id context_id] do |t|
      t.integer :id
      t.integer :context_id
      t.integer :main_id
      t.column :column_position, 'smallint'
      t.boolean :is_subnational
      t.text :name
      t.text :node_type
      t.text :profile
      t.text :geo_id
      t.text :role
      t.column :name_tsvector, 'tsvector'
      t.column :years, 'smallint[]'
    end

    Api::V3::Readonly::NodeWithFlows.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )

    drop_view :nodes_mv, materialized: true
  end

  def down
    drop_table :nodes_with_flows
    drop_view :nodes_with_flows_v, materialized: false
    create_view :nodes_mv, version: 9, materialized: true
    add_index :nodes_mv, [:context_id, :id],
      name: 'nodes_mv_context_id_id_idx',
      unique: true
    add_index :nodes_mv, :name_tsvector,
      name: 'nodes_mv_name_tsvector_idx',
      using: :gin
  end
end
