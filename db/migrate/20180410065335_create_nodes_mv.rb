class CreateNodesMv < ActiveRecord::Migration[5.1]
  def up
    create_view :nodes_mv, version: 1, materialized: true
    add_index :nodes_mv,
      [:context_id],
      name: 'nodes_mv_context_id_idx'
    add_index :nodes_mv,
      "to_tsvector('simple', COALESCE(name, ''))",
      name: 'nodes_mv_name_idx',
      using: :gin
  end

  def down
    drop_view :nodes_mv, materialized: true
  end
end
