class CreateAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :quants do |t|
        t.text :name, null: false
        t.text :display_name, null: false
        t.text :unit
        t.text :unit_type
        t.boolean :tooltip, null: false, default: false # TODO: do we need this
        t.text :tooltip_text
        t.timestamps
      end
      execute 'ALTER TABLE quants ADD CONSTRAINT quants_name_key UNIQUE (name)'
      execute "ALTER TABLE quants ADD CONSTRAINT quants_unit_type_check CHECK (unit_type IN ('currency', 'area', 'count', 'volume', 'unitless'))"

      create_table :inds do |t|
        t.text :name, null: false
        t.text :display_name, null: false
        t.text :unit
        t.text :unit_type
        t.boolean :tooltip, null: false, default: false # TODO: do we need this
        t.text :tooltip_text
        t.timestamps
      end
      execute 'ALTER TABLE inds ADD CONSTRAINT inds_name_key UNIQUE (name)'
      execute "ALTER TABLE inds ADD CONSTRAINT inds_unit_type_check CHECK (unit_type IN ('currency', 'ratio', 'score', 'unitless') )"

      create_table :quals do |t|
        t.text :name, null: false
        t.text :display_name, null: false
        t.boolean :tooltip, null: false, default: false # TODO: do we need this
        t.text :tooltip_text
        t.timestamps
      end
      execute 'ALTER TABLE quals ADD CONSTRAINT quals_name_key UNIQUE (name)'

      create_view :attributes_mv, materialized: true

      add_index :attributes_mv, :id, unique: true,
        name: 'index_attributes_mv_id_idx'
      add_index :attributes_mv, :name, unique: true,
        name: 'attributes_mv_name_idx'
    end
  end

  def down
    with_search_path('revamp') do
      drop_view :attributes_mv, materialized: true
      drop_table :quants
      drop_table :inds
      drop_table :quals
    end
  end
end
