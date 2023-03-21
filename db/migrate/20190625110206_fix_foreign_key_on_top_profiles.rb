class FixForeignKeyOnTopProfiles < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :top_profiles, :nodes
    remove_foreign_key :top_profiles, :contexts
    add_foreign_key :top_profiles, :nodes, on_delete: :cascade, on_update: :cascade
    add_foreign_key :top_profiles, :contexts, on_delete: :cascade, on_update: :cascade
  end
end
