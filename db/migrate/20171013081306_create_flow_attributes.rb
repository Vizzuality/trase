class CreateFlowAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :flow_quants do |t|
        t.references :flow, null: false, foreign_key: {on_delete: :cascade}
        t.references :quant, null: false, foreign_key: {on_delete: :cascade},
          index: {name: 'flow_quants_quant_id_idx'}
        t.column :value, 'double precision', null: false
        t.timestamps
      end
      execute 'ALTER TABLE flow_quants ADD CONSTRAINT flow_quants_flow_id_quant_id_key UNIQUE (flow_id, quant_id)'

      create_table :flow_inds do |t|
        t.references :flow, null: false, foreign_key: {on_delete: :cascade}
        t.references :ind, null: false, foreign_key: {on_delete: :cascade},
          index: {name: 'flow_inds_ind_id_idx'}
        t.column :value, 'double precision', null: false
        t.timestamps
      end
      execute 'ALTER TABLE flow_inds ADD CONSTRAINT flow_inds_flow_id_ind_id_key UNIQUE (flow_id, ind_id)'

      create_table :flow_quals do |t|
        t.references :flow, null: false, foreign_key: {on_delete: :cascade}
        t.references :qual, null: false, foreign_key: {on_delete: :cascade},
          index: {name: 'flow_quals_qual_id_idx'}
        t.text :value, null: false
        t.timestamps
      end
      execute 'ALTER TABLE flow_quals ADD CONSTRAINT flow_quals_flow_id_qual_id_key UNIQUE (flow_id, qual_id)'
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
