class RemoveParentIdFromCommodities < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      remove_column :commodities, :parent_id
    end
  end

  def down
    with_search_path('revamp') do
      add_reference :commodities, :parent, foreign_key: {on_delete: :cascade, to_table: :commodities},
          index: {name: 'commodities_parent_id_idx'}
    end
  end
end
