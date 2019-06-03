class DeleteOldSchemaMigrations < ActiveRecord::Migration[5.2]
  def change
    execute "DELETE FROM schema_migrations WHERE version < '20190215113824'"
  end
end
