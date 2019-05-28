class CreateUnusedIndexesView < ActiveRecord::Migration[5.2]
  def change
    create_schema :maintenance
    with_search_path('maintenance') do
      create_view :unused_indexes, version: 1, materialized: false
    end
  end
end
