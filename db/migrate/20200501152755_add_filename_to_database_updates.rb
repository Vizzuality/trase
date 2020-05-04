class AddFilenameToDatabaseUpdates < ActiveRecord::Migration[5.2]
  def change
    add_column :database_updates, :filename, :text
  end
end
