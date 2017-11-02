class AddImageToPost < ActiveRecord::Migration[5.0]
  def change
    add_attachment :posts, :image
  end
end
