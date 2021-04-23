class AddAggregationMethod < ActiveRecord::Migration[5.2]
  def change
    add_column :quant_properties, :aggregation_method, :text
    add_column :ind_properties, :aggregation_method, :text
  end
end
