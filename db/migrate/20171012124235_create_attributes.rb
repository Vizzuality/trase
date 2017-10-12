class CreateAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :attributes do |t|
        t.text :name, null: false
        t.text :type, null: false
        t.text :unit
        t.text :unit_type
        t.boolean :tooltip, null: false, default: false
        t.text :tooltip_text
        t.text :frontend_name
        t.timestamps
      end

      add_index :attributes, :name, unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :attributes
    end
  end
end
