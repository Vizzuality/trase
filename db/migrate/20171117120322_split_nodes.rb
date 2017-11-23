class SplitNodes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :node_properties do |t|
        t.references :node, null: false, foreign_key: {on_delete: :cascade}
        t.boolean :is_domestic_consumption, null: false, default: false
        t.timestamps
      end
      execute 'ALTER TABLE node_properties ADD CONSTRAINT node_properties_node_id_key UNIQUE (node_id)'
      remove_column :nodes, :is_domestic_consumption
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :node_properties
      add_column :nodes, :is_domestic_consumption, :boolean, null: false, default: false
    end
  end
end
