class SplitIndsQualsAndQuants < ActiveRecord::Migration[5.0]
  include SearchPathHelpers
  include DependentAttributeViewsHelpers

  def up
    with_search_path('revamp') do
      create_table :ind_properties do |t|
        t.references :ind, null: false, foreign_key: {on_delete: :cascade}
        t.text :display_name, null: false
        t.text :unit_type
        t.text :tooltip_text
        t.boolean :is_visible_on_place_profile, null: false, default: false
        t.boolean :is_visible_on_actor_profile, null: false, default: false
        t.boolean :is_temporal_on_place_profile, null: false, default: false
        t.boolean :is_temporal_on_actor_profile, null: false, default: false
        t.timestamps
      end
      execute 'ALTER TABLE ind_properties ADD CONSTRAINT ind_properties_ind_id_key UNIQUE (ind_id)'
      execute "ALTER TABLE ind_properties ADD CONSTRAINT ind_properties_unit_type_check CHECK (unit_type IN ('currency', 'ratio', 'score', 'unitless') )"

      create_table :qual_properties do |t|
        t.references :qual, null: false, foreign_key: {on_delete: :cascade}
        t.text :display_name, null: false
        t.text :tooltip_text
        t.boolean :is_visible_on_place_profile, null: false, default: false
        t.boolean :is_visible_on_actor_profile, null: false, default: false
        t.boolean :is_temporal_on_place_profile, null: false, default: false
        t.boolean :is_temporal_on_actor_profile, null: false, default: false
        t.timestamps
      end
      execute 'ALTER TABLE qual_properties ADD CONSTRAINT qual_properties_qual_id_key UNIQUE (qual_id)'

      create_table :quant_properties do |t|
        t.references :quant, null: false, foreign_key: {on_delete: :cascade}
        t.text :display_name, null: false
        t.text :unit_type
        t.text :tooltip_text
        t.boolean :is_visible_on_place_profile, null: false, default: false
        t.boolean :is_visible_on_actor_profile, null: false, default: false
        t.boolean :is_temporal_on_place_profile, null: false, default: false
        t.boolean :is_temporal_on_actor_profile, null: false, default: false
        t.timestamps
      end
      execute 'ALTER TABLE quant_properties ADD CONSTRAINT quant_properties_quant_id_key UNIQUE (quant_id)'
      execute "ALTER TABLE quant_properties ADD CONSTRAINT quant_properties_unit_type_check CHECK (unit_type IN ('currency', 'area', 'count', 'volume', 'unitless'))"

      drop_dependent_views

      update_view :attributes_mv,
        version: 3,
        revert_to_version: 2,
        materialized: true

      create_dependent_views(2)

      remove_column :inds, :display_name
      remove_column :inds, :unit_type
      remove_column :inds, :tooltip
      remove_column :inds, :tooltip_text

      remove_column :quals, :display_name
      remove_column :quals, :tooltip
      remove_column :quals, :tooltip_text

      remove_column :quants, :display_name
      remove_column :quants, :unit_type
      remove_column :quants, :tooltip
      remove_column :quants, :tooltip_text
    end
  end

  def down
    with_search_path('revamp') do
      add_column :inds, :display_name, :text, null: false
      add_column :inds, :unit_type, :text
      add_column :inds, :tooltip, :boolean, null: false, default: false
      add_column :inds, :tooltip_text, :text
      execute "ALTER TABLE inds ADD CONSTRAINT inds_unit_type_check CHECK (unit_type IN ('currency', 'ratio', 'score', 'unitless') )"

      add_column :quals, :display_name, :text, null: false
      add_column :quals, :unit_type, :text
      add_column :quals, :tooltip, :boolean, null: false, default: false
      add_column :quals, :tooltip_text, :text

      add_column :quants, :display_name, :text, null: false
      add_column :quants, :unit_type, :text
      add_column :quants, :tooltip, :boolean, null: false, default: false
      add_column :quants, :tooltip_text, :text
      execute "ALTER TABLE quants ADD CONSTRAINT quants_unit_type_check CHECK (unit_type IN ('currency', 'area', 'count', 'volume', 'unitless'))"

      drop_dependent_views

      update_view :attributes_mv,
        version: 2,
        revert_to_version: 1,
        materialized: true

      create_dependent_views(2)
      drop_table :ind_properties
      drop_table :qual_properties
      drop_table :quant_properties
    end
  end
end
