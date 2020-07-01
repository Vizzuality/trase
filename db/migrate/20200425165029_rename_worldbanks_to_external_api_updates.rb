class RenameWorldbanksToExternalApiUpdates < ActiveRecord::Migration[5.2]
  def up
    rename_table :worldbanks, :external_api_updates
    add_column :external_api_updates, :resource_name, :text
    execute 'UPDATE external_api_updates SET resource_name = name'
    execute "UPDATE external_api_updates SET name = 'WB'"
  end

  def down
    execute 'UPDATE external_api_updates SET name = COALESCE(resource_name, name)'
    remove_column :external_api_updates, :resource_name
    rename_table :external_api_updates, :worldbanks
  end
end
