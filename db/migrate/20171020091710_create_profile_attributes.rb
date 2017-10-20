class CreateProfileAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :profiles do |t|
        t.references :context_node_type, null: false, foreign_key: true
        t.text :name
        t.timestamps
      end

      add_index :profiles, [:context_node_type_id, :name], unique: true
      execute "ALTER TABLE profiles ADD CONSTRAINT check_profiles_on_name CHECK (name IN ('actor', 'place') )"

      remove_column :context_node_types, :profile_type

      create_table :charts do |t|
        t.references :profile, null: false, foreign_key: true
        t.references :parent, foreign_key: {on_delete: :cascade, to_table: :charts}, index: true
        t.text :code, null: false
        t.text :title, null: false
        t.integer :position, null: false
        t.timestamps
      end

      add_index :charts, [:profile_id, :parent_id, :position], unique: true

      create_table :chart_attributes do |t|
        t.references :chart, null: false, foreign_key: {on_delete: :cascade}
        t.integer :position
        t.timestamps
      end

      add_index :chart_attributes, [:chart_id, :position]

      create_table :chart_quants do |t|
        t.references :chart_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :quant, null: false, foreign_key: {on_delete: :cascade}
        t.integer :years, array: true
        t.timestamps
      end

      add_index :chart_quants, [:chart_attribute_id, :quant_id], unique: true

      create_table :chart_inds do |t|
        t.references :chart_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :ind, null: false, foreign_key: {on_delete: :cascade}
        t.integer :years, array: true
        t.timestamps
      end

      add_index :chart_inds, [:chart_attribute_id, :ind_id], unique: true

      create_table :chart_quals do |t|
        t.references :chart_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :qual, null: false, foreign_key: {on_delete: :cascade}
        t.integer :years, array: true
        t.timestamps
      end

      add_index :chart_quals, [:chart_attribute_id, :qual_id], unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :chart_quals
      drop_table :chart_inds
      drop_table :chart_quants
      drop_table :chart_attributes
      drop_table :charts
      drop_table :profiles
    end
  end
end
