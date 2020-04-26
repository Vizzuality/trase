class AddUpdatedAtToComTrade < ActiveRecord::Migration[5.2]
  def up
    add_column :countries_com_trade_indicators, :updated_at, :timestamptz
    execute 'UPDATE countries_com_trade_indicators SET updated_at = NOW()'
    change_column :countries_com_trade_indicators, :updated_at, :timestamptz, null: false
  end

  def down
    remove_column :countries_com_trade_indicators, :updated_at
  end
end
