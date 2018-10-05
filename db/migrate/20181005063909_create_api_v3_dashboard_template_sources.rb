class CreateApiV3DashboardTemplateSources < ActiveRecord::Migration[5.1]
  def change
    create_table :dashboard_template_sources do |t|
      t.integer :dashboard_template_id
      t.integer :node_id

      t.timestamps
    end
  end
end
