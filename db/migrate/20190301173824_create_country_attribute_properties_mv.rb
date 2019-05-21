class CreateCountryAttributePropertiesMv < ActiveRecord::Migration[5.2]
  def change
    create_view :country_attribute_properties_mv, version: 1, materialized: true

    add_index :country_attribute_properties_mv, :id, unique: true,
        name: 'index_country_attribute_properties_mv_id_idx'
  end
end
