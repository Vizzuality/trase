SELECT
  f.node_id,
  n.geo_id,
  CASE
    WHEN cn.node_type = ANY (ARRAY['COUNTRY OF PRODUCTION'::text, 'BIOME'::text, 'LOGISTICS HUB'::text, 'STATE'::text])
    THEN UPPER(n.name)
    ELSE INITCAP(n.name)
  END AS name,
  CASE WHEN cn.node_type = 'COUNTRY OF PRODUCTION' THEN FALSE ELSE TRUE END AS needs_total,
  cn.column_group,
  cn.column_position,
  f.flow_id,
  f.year,
  f.context_id
FROM (
  SELECT
    flows.flow_id,
    flows.year,
    a.node_id,
    a."position",
    flows.context_id
  FROM flows, LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position")
) f
JOIN (
  SELECT
    context_nodes.context_id,
    context_nodes.column_group,
    context_nodes.column_position,
    context_nodes.node_type_id,
    node_types.node_type
  FROM context_nodes
  JOIN node_types ON node_types.node_type_id = context_nodes.node_type_id
) cn ON f."position" = (cn.column_position + 1) AND f.context_id = cn.context_id
JOIN nodes n ON n.node_id = f.node_id;
