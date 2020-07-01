class AddWorldbanks < ActiveRecord::Migration[5.2]
  def change
    create_table :worldbanks do |t|
      t.text :name, null: false
      t.datetime :last_update, null: false
    end
  end
end
