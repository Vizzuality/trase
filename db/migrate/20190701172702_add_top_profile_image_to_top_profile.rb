class AddTopProfileImageToTopProfile < ActiveRecord::Migration[5.2]
  def change
    add_reference :top_profiles, :top_profile_image, foreign_key: true
  end
end
