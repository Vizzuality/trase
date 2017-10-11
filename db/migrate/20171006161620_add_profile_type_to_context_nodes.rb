class AddProfileTypeToContextNodes < ActiveRecord::Migration[5.0]
  def change
    add_column :context_nodes, :profile_type, :string
    update_sql = <<-SQL
UPDATE context_nodes
SET profile_type = CASE node_type_id
WHEN 6 THEN 'actor'
WHEN 7 THEN 'actor'
WHEN 3 THEN 'place'
END
WHERE context_nodes.context_id = 1
;
    SQL
    execute update_sql
    remove_column :node_types, :profile_type
  end
end
