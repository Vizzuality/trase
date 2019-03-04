class CreateQualContextProperties < ActiveRecord::Migration[5.2]
  def change
    create_table :qual_context_properties do |t|
      t.text :tooltip_text
      t.references :context, foreign_key: true
      t.references :qual, foreign_key: true

      t.timestamps
    end
  end
end
