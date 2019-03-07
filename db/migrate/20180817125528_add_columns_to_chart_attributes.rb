class AddColumnsToChartAttributes < ActiveRecord::Migration[5.1]
  def change
    add_column :chart_attributes, :display_name, :text
    add_column :chart_attributes, :legend_name, :text
    add_column :chart_attributes, :display_type, :text
    add_column :chart_attributes, :display_style, :text
    add_column :chart_attributes, :state_average, :boolean, null: false, default: false
  end
end
