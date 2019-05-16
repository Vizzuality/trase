class AddTsvectorToNodesMv < ActiveRecord::Migration[5.2]
  def up
    execute 'DROP INDEX IF EXISTS nodes_mv_name_idx'
    update_view :nodes_mv,
                version: 6,
                revert_to_version: 5,
                materialized: true
    add_index :nodes_mv, :name_tsvector,
      name: 'nodes_mv_name_tsvector_idx',
      using: :gin
  end

  def down
    execute 'DROP INDEX IF EXISTS nodes_mv_name_tsvector_idx'
    update_view :nodes_mv,
                version: 5,
                revert_to_version: 4,
                materialized: true
    add_index :nodes_mv,
      "to_tsvector('simple', COALESCE(name, ''))",
      name: 'nodes_mv_name_idx',
      using: :gin
  end
end
