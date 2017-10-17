class CreateDownloadAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :download_attributes do |t|
        t.references :context, null: false, foreign_key: {on_delete: :cascade}
        t.references :attribute, null: false, foreign_key: {on_delete: :cascade}
        t.integer :position, null: false
        t.text :name_in_download, null: false
        t.timestamps
      end

      add_index :download_attributes, [:context_id, :position], unique: true
      add_index :download_attributes, [:context_id, :attribute_id], unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :download_attributes
    end
  end
end
