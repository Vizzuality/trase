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
      add_index :download_versions, [:context_id, :symbol], unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :download_versions
    end
  end
end
