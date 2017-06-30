class AddIsGeoColumn < ActiveRecord::Migration[5.0]
  def change
    add_column :node_types, :is_geo_column, :boolean
  end
end
