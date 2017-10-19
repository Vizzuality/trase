class CreateNodeAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :node_quants do |t|
        t.references :node, null: false, foreign_key: {on_delete: :cascade}, index: true
        t.references :quant, null: false, foreign_key: {on_delete: :cascade}, index: true
        t.integer :year
        t.column :value, 'double precision', null: false
        t.timestamps
      end

      add_index :node_quants, [:node_id, :quant_id, :year], unique: true

      create_table :node_inds do |t|
        t.references :node, null: false, foreign_key: {on_delete: :cascade}, index: true
        t.references :ind, null: false, foreign_key: {on_delete: :cascade}, index: true
        t.integer :year
        t.column :value, 'double precision', null: false
        t.timestamps
      end

      add_index :node_inds, [:node_id, :ind_id, :year], unique: true

      create_table :node_quals do |t|
        t.references :node, null: false, foreign_key: {on_delete: :cascade}, index: true
        t.references :qual, null: false, foreign_key: {on_delete: :cascade}, index: true
        t.integer :year
        t.text :value, null: false
        t.timestamps
      end

      add_index :node_quals, [:node_id, :qual_id, :year], unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :node_quants
      drop_table :node_inds
      drop_table :node_quals
    end
  end
end
