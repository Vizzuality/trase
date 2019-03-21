SELECT
  fp.node_id AS id,
  TRIM(fp.node) AS name,
  TO_TSVECTOR('simple', COALESCE(TRIM(fp.node)::TEXT, '')) AS name_tsvector,
  fp.node_type_id,
  fp.node_type,
  quals.name AS parent_node_type,
  node_quals.value AS parent_name,
  all_fp.country_id,
  all_fp.commodity_id,
  all_fp.node_id
FROM
dashboards_flow_paths_mv all_fp
JOIN dashboards_flow_paths_mv fp ON all_fp.flow_id = fp.flow_id
JOIN context_node_types_mv cnt_mv ON fp.node_type_id = cnt_mv.node_type_id AND fp.context_id = cnt_mv.context_id
LEFT JOIN quals ON quals.name = cnt_mv.parent_node_type
LEFT JOIN node_quals ON fp.node_id = node_quals.node_id AND quals.id = node_quals.qual_id
WHERE fp.category = 'source' AND all_fp.node_id <> fp.node_id
GROUP BY (
  fp.node_id,
  fp.node,
  fp.node_type_id,
  fp.node_type,
  quals.name,
  node_quals.value,
  all_fp.country_id,
  all_fp.commodity_id,
  all_fp.node_id
);
