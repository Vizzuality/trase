class AddHighlightedField < ActiveRecord::Migration[5.0]
  def change
    add_column :posts, :highlighted, :boolean, :default => false
  end
end
