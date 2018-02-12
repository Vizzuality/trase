class CreatePages < ActiveRecord::Migration[5.1]
  def change
    with_search_path('content') do
      create_table :pages do |t|
        t.text :name, null: false
        t.text :content, null: false
      end
    end
  end
end
