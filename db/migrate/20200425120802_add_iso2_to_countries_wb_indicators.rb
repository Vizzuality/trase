class AddIso2ToCountriesWbIndicators < ActiveRecord::Migration[5.2]
  def up
    execute 'DELETE FROM worldbanks'
    execute 'DELETE FROM countries_wb_indicators'
    rename_column :countries_wb_indicators, :iso_code, :iso3
    add_column :countries_wb_indicators, :iso2, :text, null: false
  end

  def down
    rename_column :countries_wb_indicators, :iso3, :iso_code
    remove_column :countries_wb_indicators, :iso2
  end
end
