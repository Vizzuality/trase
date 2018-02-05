SELECT
  f.node_id,
  n.geo_id,
  CASE
    WHEN cn.node_type_name = ANY (ARRAY['COUNTRY OF PRODUCTION'::text, 'BIOME'::text, 'LOGISTICS HUB'::text, 'STATE'::text])
    THEN UPPER(n.name)
    ELSE INITCAP(n.name)
  END AS name,
  cn.node_type_name,
  cn.column_position,
  f.id AS flow_id,
  f.year,
  f.context_id
FROM (
  SELECT
    flows.id,
    flows.year,
    a.node_id,
    a."position",
    flows.context_id
  FROM flows, LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position")
) f
JOIN (
  SELECT
    cnt.context_id,
    cnt.column_position,
    cnt.node_type_id,
    node_types.name AS node_type_name
  FROM context_node_types cnt
  JOIN node_types ON node_types.id = cnt.node_type_id
) cn ON f."position" = (cn.column_position + 1) AND f.context_id = cn.context_id
JOIN nodes n ON n.id = f.node_id;