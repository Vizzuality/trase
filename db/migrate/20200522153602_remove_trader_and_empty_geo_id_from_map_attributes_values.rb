class RemoveTraderAndEmptyGeoIdFromMapAttributesValues < ActiveRecord::Migration[5.2]
  def change
    update_view :map_attributes_values_v, materialized: false, version: 2, revert_to_version: 1
  end
end
