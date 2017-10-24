class CreateProfileAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :profiles do |t|
        t.references :context_node_type, null: false, foreign_key: true
        t.text :name
        t.timestamps
      end
      execute "ALTER TABLE profiles ADD CONSTRAINT check_profiles_on_name CHECK (name IN ('actor', 'place') )"

      remove_column :context_node_types, :profile_type
      execute 'ALTER TABLE profiles ADD CONSTRAINT profiles_context_node_type_id_name_key UNIQUE (context_node_type_id, name)'

      create_table :charts do |t|
        t.references :profile, null: false, foreign_key: true
        t.references :parent, foreign_key: {on_delete: :cascade, to_table: :charts}, index: true
        t.text :code, null: false
        t.text :title, null: false
        t.integer :position, null: false
        t.timestamps
      end
      execute 'ALTER TABLE charts ADD CONSTRAINT charts_profile_id_parent_id_position_key UNIQUE (profile_id, parent_id, position)'

      create_table :chart_attributes do |t|
        t.references :chart, null: false, foreign_key: {on_delete: :cascade}
        t.integer :position
        t.timestamps
      end
      execute 'ALTER TABLE chart_attributes ADD CONSTRAINT chart_attributes_chart_id_position_key UNIQUE (chart_id, position)'

      create_table :chart_quants do |t|
        t.references :chart_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :quant, null: false, foreign_key: {on_delete: :cascade}
        t.integer :years, array: true
        t.timestamps
      end
      execute 'ALTER TABLE chart_quants ADD CONSTRAINT chart_quants_chart_attribute_id_quant_id_key UNIQUE (chart_attribute_id, quant_id)'

      create_table :chart_inds do |t|
        t.references :chart_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :ind, null: false, foreign_key: {on_delete: :cascade}
        t.integer :years, array: true
        t.timestamps
      end
      execute 'ALTER TABLE chart_inds ADD CONSTRAINT chart_inds_chart_attribute_id_ind_id_key UNIQUE (chart_attribute_id, ind_id)'

      create_table :chart_quals do |t|
        t.references :chart_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :qual, null: false, foreign_key: {on_delete: :cascade}
        t.integer :years, array: true
        t.timestamps
      end
      execute 'ALTER TABLE chart_quals ADD CONSTRAINT chart_quals_chart_attribute_id_qual_id_key UNIQUE (chart_attribute_id, qual_id)'
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
