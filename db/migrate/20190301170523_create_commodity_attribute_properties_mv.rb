class CreateCommodityAttributePropertiesMv < ActiveRecord::Migration[5.2]
  def change
    create_view :commodity_attribute_properties_mv, version: 1, materialized: true

    add_index :commodity_attribute_properties_mv, :id, unique: true,
        name: 'index_commodity_attribute_properties_mv_id_idx'
  end
end
