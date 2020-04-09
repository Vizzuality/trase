class ChangeNumericValueFromCountriesWbIndicators < ActiveRecord::Migration[5.2]
  def up
    change_column :countries_wb_indicators, :value, :float
  end

  def down
    change_column :countries_wb_indicators, :value, :numeric
  end
end
