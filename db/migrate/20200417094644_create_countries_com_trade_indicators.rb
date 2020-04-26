class CreateCountriesComTradeIndicators < ActiveRecord::Migration[5.2]
  def change
    create_table :countries_com_trade_indicators, {id: false, force: true} do |t|
      t.float :raw_quantity
      t.float :quantity
      t.float :value
      t.integer :commodity_id, null: false
      t.column :year, 'smallint', null: false
      t.text :iso3, null: false
      t.text :iso2, null: false
      t.text :commodity_code, null: false
      t.text :activity, null: false
    end

    create_table :countries_com_trade_aggregated_indicators, {id: false, force: true} do |t|
      t.float :quantity
      t.float :value
      t.integer :quantity_rank
      t.integer :value_rank
      t.integer :commodity_id
      t.column :year, 'smallint'
      t.text :iso2
      t.text :activity
    end

    create_view :countries_com_trade_aggregated_indicators_v,
      materialized: false
  end
end
