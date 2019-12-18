class CreateFunctionKnownPathPositions < ActiveRecord::Migration[5.2]
  def up
    execute <<~SQL
      CREATE OR REPLACE FUNCTION known_path_positions(
        path INTEGER[]
      )
      RETURNS BOOLEAN[]
      LANGUAGE 'sql'
      IMMUTABLE
      AS $BODY$
        SELECT ARRAY_AGG(NOT nodes.is_unknown)::BOOLEAN[]
        FROM UNNEST(path) WITH ORDINALITY a (node_id, position), nodes
        WHERE nodes.id = a.node_id
      $BODY$;

      COMMENT ON FUNCTION known_path_positions(integer[]) IS
      'Returns array with indexes in path where nodes are known.';
    SQL
  end

  def down
    execute 'DROP FUNCTION known_path_positions(integer[])'
  end
end
