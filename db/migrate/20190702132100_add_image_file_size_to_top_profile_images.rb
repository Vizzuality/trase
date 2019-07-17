class AddImageFileSizeToTopProfileImages < ActiveRecord::Migration[5.2]
  def change
    add_column :top_profile_images, :image_file_size, :integer
  end
end
