class AddConstraintToDownloadVersions < ActiveRecord::Migration[5.1]
  def change
    with_search_path('revamp') do
      remove_index :download_versions, :context_id
      update_sql=<<-SQL
        WITH max_versions (context_id, symbol) AS (
          SELECT context_id, MAX(symbol)
          FROM download_versions
          GROUP BY context_id
        )
        UPDATE download_versions SET is_current = FALSE
        FROM max_versions
        WHERE download_versions.context_id = max_versions.context_id
        AND download_versions.symbol <> max_versions.symbol
      SQL
      add_index :download_versions, [:context_id, :is_current],
        where: "(is_current IS TRUE)",
        unique: true
    end
  end
end
