class CreatePartialIndexOnMapAttributesMv < ActiveRecord::Migration[5.1]
  def up
    with_search_path(schema_search_path) do
      remove_index :map_attributes_mv, [:context_id]
      add_index :map_attributes_mv, [:context_id, :is_disabled],
        where: "(is_disabled IS FALSE)",
        name: 'map_attributes_mv_context_id_is_disabled_idx'
    end
  end

  def down
    with_search_path(schema_search_path) do
      remove_index :map_attributes_mv, [:context_id, :is_disabled]
      add_index :map_attributes_mv, [:context_id],
        name: 'map_attributes_mv_context_id_idx'
    end
  end

  def schema_search_path
    if schema_exists?('revamp')
      'revamp'
    else
      'public'
    end
  end
end
