class CreateMapAttributesGroups < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :map_attribute_groups do |t|
        t.references :context, null: false, foreign_key: true
        t.text :name, null: false
        t.integer :position, null: false
        t.timestamps
      end

      add_index :map_attribute_groups, [:context_id, :position], unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :map_attribute_groups
    end
  end
end
