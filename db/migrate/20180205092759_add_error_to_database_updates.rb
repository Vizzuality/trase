class AddErrorToDatabaseUpdates < ActiveRecord::Migration[5.1]
  def change
    with_search_path('revamp') do
      add_column :database_updates, :error, :text
    end
  end
end
