class AddIndexOnComTradeCommodityId < ActiveRecord::Migration[5.2]
  def change
    add_index :countries_com_trade_aggregated_indicators, :commodity_id,
      name: 'countries_com_trade_aggregated_indicators_commodity_id_idx'
  end
end
