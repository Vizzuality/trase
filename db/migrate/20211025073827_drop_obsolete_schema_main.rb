class DropObsoleteSchemaMain < ActiveRecord::Migration[5.2]
  def change
    drop_schema :main
  end
end
