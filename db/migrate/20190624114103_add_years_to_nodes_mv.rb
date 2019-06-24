class AddYearsToNodesMv < ActiveRecord::Migration[5.2]
  def change
    update_view :nodes_mv,
                version: 7,
                revert_to_version: 6,
                materialized: true
  end
end
