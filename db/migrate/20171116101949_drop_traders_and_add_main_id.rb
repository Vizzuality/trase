class DropTradersAndAddMainId < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      drop_table :traders
      add_column :nodes, :main_id, :integer
    end
  end

  def down
    with_search_path('revamp') do
      remove_column :nodes, :main_id
      create_table :traders do |t|
        t.references :importer, null: false, foreign_key: {on_delete: :cascade, to_table: :nodes}
        t.references :exporter, null: false, foreign_key: {on_delete: :cascade, to_table: :nodes}
        t.timestamps
      end
      execute 'ALTER TABLE traders ADD CONSTRAINT traders_exporter_id_importer_id_key UNIQUE (exporter_id, importer_id)'
    end
  end
end
