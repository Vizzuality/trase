class CreateContextAttributePropertiesMv < ActiveRecord::Migration[5.2]
  def change
    create_view :context_attribute_properties_mv, version: 1, materialized: true

    add_index :context_attribute_properties_mv, :id, unique: true,
        name: 'index_context_attribute_properties_mv_id_idx'
  end
end
