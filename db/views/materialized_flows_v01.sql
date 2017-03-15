WITH normalized_flows AS (
  SELECT
    f.flow_id,
    f.year,
    f.node_id,
    f."position",
    f.context_id,
    cn.node_type_id,
    cn.node_type
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
      context_nodes.column_position,
      context_nodes.node_type_id,
      node_types.node_type
    FROM context_nodes
    JOIN node_types ON node_types.node_type_id = context_nodes.node_type_id
  ) cn ON f."position" = (cn.column_position + 1) AND f.context_id = cn.context_id
)
SELECT
  f.flow_id,
  f.context_id,
  f.year,
  f.node_id,
  f.node_type,
  CASE
    WHEN f.node_type = ANY (ARRAY['STATE'::text, 'BIOME'::text]) THEN upper(n.name)
    ELSE initcap(n.name)
  END AS node,
  n.geo_id,
  f_ex.node_id AS exporter_node_id,
  n_ex.name AS exporter_node,
  f_im.node_id AS importer_node_id,
  n_im.name AS importer_node,
  f_ctry.node_id AS country_node_id,
  n_ctry.name AS country_node,
  q.quant_id,
  q.name || ' (' || q.unit || ')' AS name,
  fq.value
FROM normalized_flows f
JOIN nodes n ON n.node_id = f.node_id
JOIN normalized_flows f_ex ON f.flow_id = f_ex.flow_id AND f_ex.node_type = 'EXPORTER'::text
JOIN nodes n_ex ON f_ex.node_id = n_ex.node_id
JOIN normalized_flows f_im ON f.flow_id = f_im.flow_id AND f_im.node_type = 'IMPORTER'::text
JOIN nodes n_im ON n_im.node_id = f_im.node_id
JOIN normalized_flows f_ctry ON f.flow_id = f_ctry.flow_id AND f_ctry.node_type = 'COUNTRY'::text
JOIN nodes n_ctry ON n_ctry.node_id = f_ctry.node_id
JOIN flow_quants fq ON f.flow_id = fq.flow_id
JOIN quants q ON fq.quant_id = q.quant_id
WHERE f.node_type IN ('STATE', 'BIOME', 'MUNICIPALITY')
ORDER BY CASE
  WHEN f.node_type = 'STATE' THEN 1
  WHEN f.node_type = 'BIOME' THEN 2
  ELSE 3
END, n_ex.name, n_im.name, n_ctry.name;
