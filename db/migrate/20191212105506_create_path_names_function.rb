class CreatePathNamesFunction < ActiveRecord::Migration[5.2]
  def up
    execute <<~SQL
      CREATE OR REPLACE FUNCTION path_names(
        path INTEGER[]
      )
      RETURNS TEXT[]
      LANGUAGE 'sql'
      IMMUTABLE
      AS $BODY$
        SELECT ARRAY_AGG(nodes.name ORDER BY position)::TEXT[]
        FROM UNNEST(path) WITH ORDINALITY a (node_id, position), nodes
        WHERE nodes.id = a.node_id
      $BODY$;

      COMMENT ON FUNCTION path_names(integer[]) IS
      'Returns array with node names in path.';
    SQL

    # also fix order in the other path-based function
    execute <<~SQL
      CREATE OR REPLACE FUNCTION known_path_positions(
        path INTEGER[]
      )
      RETURNS BOOLEAN[]
      LANGUAGE 'sql'
      IMMUTABLE
      AS $BODY$
        SELECT ARRAY_AGG(NOT nodes.is_unknown ORDER BY position)::BOOLEAN[]
        FROM UNNEST(path) WITH ORDINALITY a (node_id, position), nodes
        WHERE nodes.id = a.node_id
      $BODY$;

      COMMENT ON FUNCTION known_path_positions(integer[]) IS
      'Returns array with indexes in path where nodes are known.';
    SQL
  end

  def down
    execute 'DROP FUNCTION path_names(integer[])'
  end
end
