class AddExploreFieldsToCountryProperties < ActiveRecord::Migration[5.1]
  def change
    add_column :country_properties, :annotation_position_x_pos, :float
    add_column :country_properties, :annotation_position_y_pos, :float
  end
end
