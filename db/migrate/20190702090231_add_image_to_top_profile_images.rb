class AddImageToTopProfileImages < ActiveRecord::Migration[5.2]
  def change
    add_column :top_profile_images, :image_file_name, :string
    add_column :top_profile_images, :image_content_type, :string
  end
end
