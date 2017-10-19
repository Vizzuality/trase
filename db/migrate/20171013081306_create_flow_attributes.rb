class CreateFlowAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :flow_quants do |t|
        t.references :flow, null: false, foreign_key: {on_delete: :cascade}, index: true
        t.references :quant, null: false, foreign_key: {on_delete: :cascade}, index: true
        t.column :value, 'double precision', null: false
        t.timestamps
      end

      add_index :flow_quants, [:flow_id, :quant_id], unique: true

      create_table :flow_inds do |t|
        t.references :flow, null: false, foreign_key: {on_delete: :cascade}, index: true
        t.references :ind, null: false, foreign_key: {on_delete: :cascade}, index: true
        t.column :value, 'double precision', null: false
        t.timestamps
      end

      add_index :flow_inds, [:flow_id, :ind_id], unique: true

      create_table :flow_quals do |t|
        t.references :flow, null: false, foreign_key: {on_delete: :cascade}, index: true
        t.references :qual, null: false, foreign_key: {on_delete: :cascade}, index: true
        t.text :value, null: false
        t.timestamps
      end

      add_index :flow_quals, [:flow_id, :qual_id], unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :flow_quants
      drop_table :flow_inds
      drop_table :flow_quals
    end
  end
end
