class AddIsHighlightedToContextProperty < ActiveRecord::Migration[5.1]
  def change
    add_column :context_properties, :is_highlighted, :boolean
  end
end
