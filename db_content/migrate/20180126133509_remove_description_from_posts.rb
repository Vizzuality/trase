class RemoveDescriptionFromPosts < ActiveRecord::Migration[5.1]
  def change
    remove_column :posts, :description
  end
end
