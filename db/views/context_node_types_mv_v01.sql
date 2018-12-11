WITH RECURSIVE context_node_types_with_parent AS (
  SELECT
    cnt.context_id,
    cnt.column_position,
    cnt.node_type_id,
    nt.name AS node_type,
    NULL::INT AS parent_node_type_id,
    NULL AS parent_node_type
  FROM context_node_types cnt
  JOIN node_types nt ON cnt.node_type_id = nt.id
  WHERE column_position = 0
  
  UNION ALL
  
  SELECT
    cnt.context_id,
    cnt.column_position,
    cnt.node_type_id,
    nt.name,
    parent_cnt.node_type_id,
    parent_cnt.node_type
  FROM context_node_types cnt
  JOIN node_types nt ON cnt.node_type_id = nt.id
  JOIN context_node_types_with_parent parent_cnt ON cnt.column_position = parent_cnt.column_position + 1 AND cnt.context_id = parent_cnt.context_id
)
SELECT * FROM context_node_types_with_parent
ORDER BY context_id, column_position;
