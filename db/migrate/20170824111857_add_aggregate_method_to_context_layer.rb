class AddAggregateMethodToContextLayer < ActiveRecord::Migration[5.0]
  def change
    add_column :context_layer, :aggregate_method, :string
  end
end
