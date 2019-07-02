class CreateTopProfileImages < ActiveRecord::Migration[5.2]
  def change
    create_table :top_profile_images do |t|
      t.references :commodity, foreign_key: true
    end
  end
end
