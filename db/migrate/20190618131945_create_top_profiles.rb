class CreateTopProfiles < ActiveRecord::Migration[5.2]
  def change
    create_table :top_profiles do |t|
      t.references :context, foreign_key: true, null: false
      t.references :node, foreign_key: true, null: false
    end
  end
end
