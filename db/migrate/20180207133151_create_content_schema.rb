class CreateContentSchema < ActiveRecord::Migration[5.1]
  def up
    execute 'CREATE SCHEMA IF NOT EXISTS content'
  end

  def down
    execute 'DROP SCHEMA IF EXISTS content'
  end
end
