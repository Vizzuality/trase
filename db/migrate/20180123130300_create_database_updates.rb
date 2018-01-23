class CreateDatabaseUpdates < ActiveRecord::Migration[5.1]
  def change
    with_search_path('revamp') do
      create_table :database_updates do |t|
        t.json :stats

        t.timestamps
      end
    end
  end
end
