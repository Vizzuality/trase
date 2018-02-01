class RemovePostTitleColor < ActiveRecord::Migration[5.1]
  def change
    remove_column :posts, :title_color
  end
end
