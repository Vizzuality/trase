class CreateApiV3DashboardTemplateCommodities < ActiveRecord::Migration[5.1]
  def change
    create_table :dashboard_template_commodities do |t|
      t.integer :dashboard_template_id
      t.integer :commodity_id

      t.timestamps
    end
  end
end
