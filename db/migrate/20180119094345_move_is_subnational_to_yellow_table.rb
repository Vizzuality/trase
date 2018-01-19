class MoveIsSubnationalToYellowTable < ActiveRecord::Migration[5.1]
  def change
    with_search_path('revamp') do
      add_column :context_properties, :is_subnational, :boolean, null: false, default: false
      execute <<-SQL
        UPDATE context_properties SET is_subnational = contexts.is_subnational
        FROM contexts
        WHERE contexts.id = context_properties.context_id
      SQL
      remove_column :contexts, :is_subnational
    end
  end
end
