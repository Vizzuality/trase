class AddProfileTypeToTopProfileImages < ActiveRecord::Migration[5.2]
  def change
    add_column :top_profile_images, :profile_type, :string
  end
end
