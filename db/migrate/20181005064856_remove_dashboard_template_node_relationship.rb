class RemoveDashboardTemplateNodeRelationship < ActiveRecord::Migration[5.1]
  def change
    drop_table :dashboard_template_nodes
  end
end
