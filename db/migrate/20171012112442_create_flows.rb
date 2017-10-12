class CreateFlows < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :flows do |t|
        t.references :context, null: false, foreign_key: true, index: true
        t.column :year, 'smallint', null: false
        t.integer :path, array: true, default: []
        t.timestamps
      end

      add_index :flows, [:context_id, :year]
      add_index :flows, [:path]
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :flows
    end
  end
end
