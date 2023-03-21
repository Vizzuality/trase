class FixForeignKeys < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :top_profile_images, :commodities
    add_foreign_key :top_profile_images, :commodities, on_delete: :cascade, on_update: :cascade
    remove_foreign_key :top_profiles, :top_profile_images
    add_foreign_key :top_profiles, :top_profile_images, on_delete: :cascade, on_update: :cascade
  end
end
