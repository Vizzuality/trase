class DropObsoleteServerAndUserMapping < ActiveRecord::Migration[5.2]
  def up
    execute 'DROP SERVER IF EXISTS trase_server CASCADE'
  end

  def down
  end
end
