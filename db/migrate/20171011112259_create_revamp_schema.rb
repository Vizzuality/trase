class CreateRevampSchema < ActiveRecord::Migration[5.0]
  def up
    execute 'CREATE SCHEMA IF NOT EXISTS revamp'
  end

  def down
    execute 'DROP SCHEMA IF EXISTS revamp'
  end
end
