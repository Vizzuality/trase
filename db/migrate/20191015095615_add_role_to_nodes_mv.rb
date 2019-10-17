class AddRoleToNodesMv < ActiveRecord::Migration[5.2]
  def change
    update_view :nodes_mv,
                version: 9,
                revert_to_version: 8,
                materialized: true
  end
end
