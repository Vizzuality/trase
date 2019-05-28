SELECT
  flow_nodes.id,
  flow_nodes.context_id,
  flow_nodes.year,
  ARRAY_AGG(nodes.id ORDER BY cnt.column_position) AS path,
  JSONB_OBJECT_AGG(
    cnt.column_position,
    JSONB_BUILD_OBJECT(
      'node_id', nodes.id,
      'node', nodes.name,
      'node_type_id', cnt.node_type_id,
      'node_type', node_types.name,
      'is_unknown', nodes.is_unknown
    )
    ORDER BY cnt.column_position
  ) AS jsonb_path
FROM (
  SELECT
    flows.id,
    flows.context_id,
    flows.year,
    a.node_id,
    a."position" - 1 AS column_position
  FROM flows,
  LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position")
) flow_nodes
JOIN nodes ON flow_nodes.node_id = nodes.id
JOIN context_node_types cnt ON flow_nodes.context_id = cnt.context_id AND flow_nodes.column_position = cnt.column_position
JOIN node_types ON cnt.node_type_id = node_types.id
GROUP BY flow_nodes.id, flow_nodes.context_id, flow_nodes.year;
