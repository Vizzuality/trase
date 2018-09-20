SELECT
  node_id AS id,
  nodes.name,
  nodes.node_type_id,
  node_types.name AS node_type,
  flow_id
FROM dashboards_flow_paths_mv fp
JOIN nodes ON fp.node_id = nodes.id
JOIN node_types ON nodes.node_type_id = node_types.id
JOIN context_node_types cnt ON node_types.id = cnt.node_type_id AND fp.context_id = cnt.context_id
JOIN context_node_type_properties cnt_props ON cnt.id = cnt_props.context_node_type_id
WHERE node_types.name IN ('COUNTRY')
GROUP BY (node_id, nodes.name, nodes.node_type_id, node_types.name, flow_id)
ORDER BY nodes.name;
