class AddCountriesWbIndicators < ActiveRecord::Migration[5.2]
  def change
    create_table :countries_wb_indicators do |t|
      t.text :iso_code, null: false
      t.integer :year, null: false
      t.text :name, null: false
      t.numeric :value, null: false
      t.integer :rank, null: false

      t.timestamps
    end
  end
end
