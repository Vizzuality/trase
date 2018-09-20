SELECT
  fp.node_id AS id,
  nodes.name,
  nodes.node_type_id,
  cnt_mv.node_type,
  quals.name AS parent_node_type,
  node_quals.value AS parent_name,
  flow_id
FROM dashboards_flow_paths_mv fp
JOIN nodes ON fp.node_id = nodes.id
JOIN context_node_types cnt ON nodes.node_type_id = cnt.node_type_id AND fp.context_id = cnt.context_id
JOIN context_node_type_properties cnt_props ON cnt.id = cnt_props.context_node_type_id
JOIN context_node_types_mv cnt_mv ON nodes.node_type_id = cnt_mv.node_type_id AND fp.context_id = cnt_mv.context_id
LEFT JOIN quals ON quals.name = cnt_mv.parent_node_type
LEFT JOIN node_quals ON nodes.id = node_quals.node_id AND quals.id = node_quals.qual_id
WHERE cnt_props.column_group = 0
GROUP BY (
  fp.node_id,
  nodes.name,
  nodes.node_type_id,
  cnt_mv.node_type,
  quals.name,
  node_quals.value,
  flow_id
)
ORDER BY nodes.name;
