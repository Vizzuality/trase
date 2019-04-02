SELECT
  fp.node_id AS id,
  TRIM(fp.node) AS name,
  TO_TSVECTOR('simple', COALESCE(TRIM(fp.node)::TEXT, '')) AS name_tsvector,
  fp.node_type_id,
  fp.node_type,
  all_fp.country_id,
  all_fp.commodity_id,
  all_fp.node_id
FROM
dashboards_flow_paths_mv all_fp
JOIN dashboards_flow_paths_mv fp ON all_fp.flow_id = fp.flow_id
WHERE fp.category = 'destination'
GROUP BY (
  fp.node_id,
  fp.node,
  fp.node_type_id,
  fp.node_type,
  all_fp.country_id,
  all_fp.commodity_id,
  all_fp.node_id
);
