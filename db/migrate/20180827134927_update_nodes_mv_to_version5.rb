class UpdateNodesMvToVersion5 < ActiveRecord::Migration[5.1]
  def change
    update_view :nodes_mv,
                version: 5,
                revert_to_version: 4,
                materialized: true
  end
end
