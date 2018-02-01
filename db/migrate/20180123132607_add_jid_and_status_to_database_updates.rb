class AddJidAndStatusToDatabaseUpdates < ActiveRecord::Migration[5.1]
  def up
    with_search_path('revamp') do
      add_column :database_updates, :jid, :text
      add_column :database_updates, :status, :text, null: false, default: 'STARTED'
      execute "ALTER TABLE database_updates ADD CONSTRAINT database_updates_status_check CHECK (status IN ('STARTED', 'FINISHED', 'FAILED'))"
      execute 'ALTER TABLE database_updates ADD CONSTRAINT database_updates_jid_key UNIQUE (jid)'

      add_index :database_updates, [:status],
        where: "(status = 'STARTED')",
        unique: true
    end
  end

  def down
    with_search_path('revamp') do
      remove_column :database_updates, :jid
      remove_column :database_updates, :status
    end
  end
end
