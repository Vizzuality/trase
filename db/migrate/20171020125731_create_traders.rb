class CreateTraders < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :traders do |t|
        t.references :importer, null: false, foreign_key: {on_delete: :cascade, to_table: :nodes}, index: {unique: true}
        t.references :exporter, null: false, foreign_key: {on_delete: :cascade, to_table: :nodes}, index: {unique: true}
        t.timestamps
      end
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :traders
    end
  end
end
