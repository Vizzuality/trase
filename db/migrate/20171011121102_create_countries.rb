class CreateCountries < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :countries do |t|
        t.text :name, null: false
        t.text :iso2, null: false
        t.column :latitude, 'double precision', null: false
        t.column :longitude, 'double precision', null: false
        t.integer :zoom, null: false
        t.timestamps
      end
      add_index :countries, :iso2, unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :countries
    end
  end
end
