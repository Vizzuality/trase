class CreateMapAttributesGroups < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :map_attribute_groups do |t|
        t.references :context, null: false, foreign_key: {on_delete: :cascade}
        t.text :name, null: false
        t.integer :position, null: false
        t.timestamps
      end
      execute 'ALTER TABLE map_attribute_groups ADD CONSTRAINT map_attribute_groups_context_id_position_key UNIQUE (context_id, position)'
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :map_attribute_groups
    end
  end
end
