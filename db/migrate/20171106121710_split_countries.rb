class SplitCountries < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :country_properties do |t|
        t.references :country, null: false, foreign_key: {on_delete: :cascade}
        t.column :latitude, 'double precision', null: false
        t.column :longitude, 'double precision', null: false
        t.integer :zoom, null: false
        t.timestamps
      end
      execute 'ALTER TABLE country_properties ADD CONSTRAINT country_properties_country_id_key UNIQUE (country_id)'
      remove_column :countries, :latitude
      remove_column :countries, :longitude
      remove_column :countries, :zoom
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :country_properties
      add_column :countries, :latitude, 'double precision', null: false
      add_column :countries, :longitude, 'double precision', null: false
      add_column :countries, :zoom, :integer, null: false
    end
  end
end
