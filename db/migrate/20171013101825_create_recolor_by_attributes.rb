class CreateRecolorByAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :recolor_by_attributes do |t|
        t.references :context, null: false, foreign_key: {on_delete: :cascade}
        t.integer :group_number, null: false, default: 1
        t.integer :position, null: false
        t.text :legend_type, null: false
        t.text :legend_color_theme, null: false
        t.integer :interval_count
        t.text :min_value
        t.text :max_value
        t.column :divisor, 'double precision'
        t.text :tooltip_text
        t.integer :years, array: true
        t.boolean :is_disabled, null: false, default: false
        t.boolean :is_default, null: false, default: false
        t.timestamps
      end
      execute 'ALTER TABLE recolor_by_attributes ADD CONSTRAINT recolor_by_attributes_context_id_group_number_position_key UNIQUE (context_id, group_number, position)'

      create_table :recolor_by_inds do |t|
        t.references :recolor_by_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :ind, null: false, foreign_key: {on_delete: :cascade}
        t.timestamps
      end
      execute 'ALTER TABLE recolor_by_inds ADD CONSTRAINT recolor_by_inds_recolor_by_attribute_id_ind_id_key UNIQUE (recolor_by_attribute_id, ind_id)'

      create_table :recolor_by_quals do |t|
        t.references :recolor_by_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :qual, null: false, foreign_key: {on_delete: :cascade}
        t.timestamps
      end
      execute 'ALTER TABLE recolor_by_quals ADD CONSTRAINT recolor_by_quals_recolor_by_attribute_id_qual_id_key UNIQUE (recolor_by_attribute_id, qual_id)'

      create_view :recolor_by_attributes_mv, materialized: true
      add_index :recolor_by_attributes_mv, :id, unique: true,
        name: 'recolor_by_attributes_mv_id_idx'
      add_index :recolor_by_attributes_mv, [:context_id, :attribute_id],
        name: 'recolor_by_attributes_mv_context_id_attribute_id'
    end
  end

  def down
    with_search_path('revamp') do
      drop_view :recolor_by_attributes_mv, materialized: true
      drop_table :recolor_by_inds
      drop_table :recolor_by_quals
      drop_table :recolor_by_attributes
    end
  end
end
