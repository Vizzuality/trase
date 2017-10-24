class CreateNodeAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :node_quants do |t|
        t.references :node, null: false, foreign_key: {on_delete: :cascade}
        t.references :quant, null: false, foreign_key: {on_delete: :cascade},
          index: {name: 'node_quants_quant_id_idx'}
        t.integer :year
        t.column :value, 'double precision', null: false
        t.timestamps
      end
      execute 'ALTER TABLE node_quants ADD CONSTRAINT node_quants_node_id_quant_id_year_key UNIQUE (node_id, quant_id, year)'

      create_table :node_inds do |t|
        t.references :node, null: false, foreign_key: {on_delete: :cascade}
        t.references :ind, null: false, foreign_key: {on_delete: :cascade},
          index: {name: 'node_inds_ind_id_idx'}
        t.integer :year
        t.column :value, 'double precision', null: false
        t.timestamps
      end
      execute 'ALTER TABLE node_inds ADD CONSTRAINT node_inds_node_id_ind_id_year_key UNIQUE (node_id, ind_id, year)'

      create_table :node_quals do |t|
        t.references :node, null: false, foreign_key: {on_delete: :cascade}
        t.references :qual, null: false, foreign_key: {on_delete: :cascade},
          index: {name: 'node_quals_qual_id_idx'}
        t.integer :year
        t.text :value, null: false
        t.timestamps
      end
      execute 'ALTER TABLE node_quals ADD CONSTRAINT node_quals_node_id_qual_id_year_key UNIQUE (node_id, qual_id, year)'
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
