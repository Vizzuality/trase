class CreateApiV3DashboardTemplateCountries < ActiveRecord::Migration[5.1]
  def change
    create_table :dashboard_template_countries do |t|
      t.integer :dashboard_template_id
      t.integer :country_id

      t.timestamps
    end
  end
end
