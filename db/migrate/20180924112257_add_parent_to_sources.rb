class AddParentToSources < ActiveRecord::Migration[5.1]
  def change
    update_view :dashboards_sources_mv,
                version: 2,
                revert_to_version: 1,
                materialized: true
  end
end
