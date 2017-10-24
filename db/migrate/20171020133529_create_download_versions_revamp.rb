class CreateDownloadVersionsRevamp < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :download_versions do |t|
        t.references :context, null: false, foreign_key: {on_delete: :cascade}
        t.string :symbol, null: false
        t.boolean :current, null: false, default: false
        t.timestamps
      end
      execute 'ALTER TABLE download_versions ADD CONSTRAINT download_versions_context_id_symbol_key UNIQUE (context_id, symbol)'
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :download_versions
    end
  end
end
