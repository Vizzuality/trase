class CreateSiteDives < ActiveRecord::Migration[5.0]
  def change
    create_table :site_dives do |t|
      t.string :title
      t.text :description
      t.string :page_url

      t.timestamps
    end
  end
end
