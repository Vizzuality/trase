class AddEnabledColumnToContextLayer < ActiveRecord::Migration[5.0]
  def change
    add_column :context_layer, :enabled, :bool, {:default => true, :null => false}
  end
end
