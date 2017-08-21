class AddYearToContextLayer < ActiveRecord::Migration[5.0]
  def change
    add_column :context_layer, :years, :integer, array: true
  end
end
