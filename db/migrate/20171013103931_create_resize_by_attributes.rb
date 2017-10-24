class CreateResizeByAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :resize_by_attributes do |t|
        t.references :context, null: false, foreign_key: {on_delete: :cascade}
        t.integer :group_number, null: false, default: 1
        t.integer :position, null: false
        t.text :tooltip_text
        t.integer :years, array: true
        t.boolean :is_disabled, null: false, default: false
        t.boolean :is_default, null: false, default: false
        t.timestamps
      end
      execute 'ALTER TABLE resize_by_attributes ADD CONSTRAINT resize_by_attributes_context_id_group_number_position_key UNIQUE (context_id, group_number, position)'

      create_table :resize_by_quants do |t|
        t.references :resize_by_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :quant, null: false, foreign_key: {on_delete: :cascade}
        t.timestamps
      end
      execute 'ALTER TABLE resize_by_quants ADD CONSTRAINT resize_by_quants_resize_by_attribute_id_quant_id_key UNIQUE (resize_by_attribute_id, quant_id)'

      create_view :resize_by_attributes_mv, materialized: true
      add_index :resize_by_attributes_mv, :id, unique: true,
        name: 'resize_by_attributes_mv_id_idx'
      add_index :resize_by_attributes_mv, [:context_id, :attribute_id],
        name: 'resize_by_attributes_mv_context_id_attribute_id_idx'
    end
  end

  def down
    with_search_path('revamp') do
      drop_view :resize_by_attributes_mv, materialized: true
      drop_table :resize_by_quants
      drop_table :resize_by_attributes
    end
  end
end
