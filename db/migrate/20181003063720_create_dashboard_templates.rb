class CreateDashboardTemplates < ActiveRecord::Migration[5.1]
  def change
    create_table :dashboard_templates do |t|
      t.text :title, null: false
      t.text :description, null: false

      t.timestamps
    end

    add_attachment :dashboard_templates, :image
  end
end
