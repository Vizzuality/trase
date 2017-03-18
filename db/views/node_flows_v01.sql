SELECT
  f.node_id,
  n.geo_id,
  --n.name,
  CASE
    WHEN nt.node_type = ANY (ARRAY['STATE'::text, 'BIOME'::text]) THEN upper(n.name)
    ELSE initcap(n.name)
  END AS name,
  --n.node_type_id,
  nt.node_type,
  f.flow_id,
  f.year,
  --f."position",
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
JOIN nodes n ON n.node_id = f.node_id
JOIN node_types nt ON nt.node_type_id = n.node_type_id
WHERE nt.node_type IN ('STATE', 'BIOME', 'MUNICIPALITY', 'EXPORTER', 'IMPORTER', 'COUNTRY');
