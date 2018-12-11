class CreateDashboardsAttributes < ActiveRecord::Migration[5.1]
  def change
    create_table :dashboards_attribute_groups do |t|
      t.text :name, null: false
      t.integer :position, null: false
      t.timestamps
    end

    create_table :dashboards_attributes do |t|
      t.references :dashboards_attribute_group, null: false, foreign_key: {on_delete: :cascade}
      t.integer :position, null: false
      t.string :chart_type, null: false
      t.timestamps
    end

    create_table :dashboards_quants do |t|
      t.references :dashboards_attribute, null: false, foreign_key: {on_delete: :cascade}
      t.references :quant, null: false, foreign_key: {on_delete: :cascade}
      t.timestamps
    end

    create_table :dashboards_quals do |t|
      t.references :dashboards_attribute, null: false, foreign_key: {on_delete: :cascade}
      t.references :qual, null: false, foreign_key: {on_delete: :cascade}
      t.timestamps
    end

    create_table :dashboards_inds do |t|
      t.references :dashboards_attribute, null: false, foreign_key: {on_delete: :cascade}
      t.references :ind, null: false, foreign_key: {on_delete: :cascade}
      t.timestamps
    end

    reversible do |dir|
      dir.up do
        execute 'ALTER TABLE dashboards_attribute_groups ADD CONSTRAINT dashboards_attribute_groups_position_key UNIQUE (position)'
        execute 'ALTER TABLE dashboards_attributes ADD CONSTRAINT dashboards_attributes_dashboards_attribute_group_id_position_key UNIQUE (dashboards_attribute_group_id, position)'
        execute 'ALTER TABLE dashboards_inds ADD CONSTRAINT dashboards_inds_dashboards_attribute_id_ind_id_key UNIQUE (dashboards_attribute_id, ind_id)'
        execute 'ALTER TABLE dashboards_quals ADD CONSTRAINT dashboards_quals_dashboards_attribute_id_qual_id_key UNIQUE (dashboards_attribute_id, qual_id)'
        execute 'ALTER TABLE dashboards_quants ADD CONSTRAINT dashboards_quants_dashboards_attribute_id_quant_id_key UNIQUE (dashboards_attribute_id, quant_id)'
      end
      dir.down do
        # no-op
      end
    end
  end
end
