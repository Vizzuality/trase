class CreatePosts < ActiveRecord::Migration[5.0]
  def change
    create_table :posts do |t|
      t.string :title
      t.datetime :date
      t.string :image
      t.string :post_url
      t.integer :state
      t.text :description

      t.timestamps
    end
  end
end
