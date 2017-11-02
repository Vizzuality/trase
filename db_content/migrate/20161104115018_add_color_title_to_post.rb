class AddColorTitleToPost < ActiveRecord::Migration[5.0]
  def change
    add_column :posts, :title_color, :string
  end
end
