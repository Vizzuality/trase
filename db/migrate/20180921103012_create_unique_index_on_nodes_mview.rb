class CreateUniqueIndexOnNodesMview < ActiveRecord::Migration[5.1]
  def change
    add_index :nodes_mv, [:context_id, :id], unique: true, name: 'nodes_mv_context_id_id_idx'
  end
end
