class CreateRecolorByAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :recolor_by_attributes do |t|
        t.references :context, null: false, foreign_key: {on_delete: :cascade}
        t.references :attribute, null: false, foreign_key: {on_delete: :cascade}
        t.integer :group_number, null: false, default: 1
        t.integer :position, null: false
        t.text :legend_type, null: false
        t.text :legend_color_theme, null: false
        t.integer :interval_count
        t.text :min_value
        t.text :max_value
        t.column :divisor, 'double precision'
        t.text :tooltip_text
        t.integer :years, array: true, default: []
        t.boolean :is_disabled, null: false, default: false
        t.boolean :is_default, null: false, default: false
        t.timestamps
      end

      add_index :recolor_by_attributes, [:context_id, :group_number, :position], unique: true,
        name: 'index_recolor_by_attributes_on_context_id_group_number_position'
      add_index :recolor_by_attributes, [:context_id, :attribute_id], unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :recolor_by_attributes
    end
  end
end
