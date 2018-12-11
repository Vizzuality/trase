class AddCategoryToDashboardTemplate < ActiveRecord::Migration[5.1]
  def change
    add_column :dashboard_templates, :category, :string
  end
end
