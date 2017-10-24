class CreateNodes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :nodes do |t|
        t.references :node_type, null: false, foreign_key: {on_delete: :cascade},
          index: {name: 'nodes_node_type_id_idx'}
        t.text :name, null: false
        t.text :geo_id
        t.boolean :is_domestic_consumption, null: false, default: false
        t.boolean :is_unknown, null: false, default: false
        t.timestamps
      end
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :nodes
    end
  end
end
