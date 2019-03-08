class CreateIndContextProperties < ActiveRecord::Migration[5.2]
  def change
    create_table :ind_context_properties do |t|
      t.text :tooltip_text, null: false
      t.references :context, foreign_key: true, null: false
      t.references :ind, foreign_key: true, null: false

      t.timestamps
    end
  end
end
