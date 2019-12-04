class CreateNodesWithFlowsPerYear < ActiveRecord::Migration[5.2]
  def up
    create_table :nodes_with_flows_per_year, primary_key: %i[node_id context_id year] do |t|
      t.integer :node_id
      t.integer :context_id
      t.integer :country_id
      t.integer :commodity_id
      t.integer :node_type_id
      t.integer :context_node_type_id
      t.column :year, 'smallint'
      t.column :nodes_ids, 'int[]'
      t.text :name
      t.column :name_tsvector, 'tsvector'
      t.text :node_type
      t.text :geo_id
      t.boolean :is_unknown
    end

    create_view 'nodes_with_flows_per_year_v', materialized: false
  end

  def down
    drop_table :nodes_with_flows_per_year
    drop_view 'nodes_with_flows_per_year_v', materialized: false
  end
end
