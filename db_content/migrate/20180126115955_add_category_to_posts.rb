class AddCategoryToPosts < ActiveRecord::Migration[5.1]
  def change
    add_column :posts, :category, :text
  end
end
