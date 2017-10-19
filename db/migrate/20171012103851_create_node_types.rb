class CreateNodeTypes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :node_types do |t|
        t.text :name, null: false
        t.timestamps
      end
      add_index :node_types, :name, unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :node_types
    end
  end
end
