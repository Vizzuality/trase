class CreateMethodsAndDataDocs < ActiveRecord::Migration[5.2]
  def change
    create_table :methods_and_data_docs do |t|
      t.timestamps
      t.references :context, null: false, foreign_key: {on_delete: :cascade}
      t.text :version, null: false
      t.text :language, null: false
      t.text :url, null: false
    end
  end
end
