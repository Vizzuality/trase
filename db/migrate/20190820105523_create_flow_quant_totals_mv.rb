class CreateFlowQuantTotalsMv < ActiveRecord::Migration[5.2]
  def change
    create_view :flow_quant_totals_mv,
      materialized: true,
      version: 1

    add_index :flow_quant_totals_mv,
      [:commodity_id, :country_id, :quant_id],
      unique: true,
      name: 'flow_quant_totals_mv_commodity_id_country_id_quant_id_idx'
  end
end
