class CreateResizeByAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :resize_by_attributes do |t|
        t.references :context, null: false, foreign_key: {on_delete: :cascade}
        t.references :attribute, null: false, foreign_key: {on_delete: :cascade}
        t.integer :group_number, null: false, default: 1
        t.integer :position, null: false
        t.text :tooltip_text
        t.boolean :is_disabled, null: false, default: false
        t.boolean :is_default, null: false, default: false
        t.timestamps
      end

      add_index :resize_by_attributes, [:context_id, :group_number, :position], unique: true,
        name: 'index_resize_by_attributes_on_context_id_group_number_position'
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :resize_by_attributes
    end
  end
end
