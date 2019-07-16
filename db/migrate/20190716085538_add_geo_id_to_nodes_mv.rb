class AddGeoIdToNodesMv < ActiveRecord::Migration[5.2]
  def change
    update_view :nodes_mv,
                version: 8,
                revert_to_version: 7,
                materialized: true
  end
end
