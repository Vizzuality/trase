class CreateContextsMv < ActiveRecord::Migration[5.2]
  def up
    create_view :contexts_mv, version: 1, materialized: true

    add_index :contexts_mv, :id, unique: true, name: :contexts_mv_id_idx
  end

  def down
    drop_view :contexts_mv, materialized: true
  end
end
