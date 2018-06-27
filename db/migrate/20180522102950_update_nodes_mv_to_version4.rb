class UpdateNodesMvToVersion4 < ActiveRecord::Migration[5.1]
  def change
    update_view :nodes_mv,
                version: 4,
                revert_to_version: 3,
                materialized: true
  end
end
