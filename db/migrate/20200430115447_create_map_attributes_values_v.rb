class CreateMapAttributesValuesV < ActiveRecord::Migration[5.2]
  def change
    create_view :map_attributes_values_v,
      materialized: false
  end
end
