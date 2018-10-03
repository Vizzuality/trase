SELECT
  fp.node_id AS id,
  fp.node AS name,
  to_tsvector('simple', coalesce(fp.node::text, '')) AS name_tsvector,
  fp.node_type_id,
  fp.node_type,
  all_fp.country_id,
  all_fp.commodity_id,
  all_fp.node_id
FROM
dashboards_flow_paths_mv all_fp
JOIN dashboards_flow_paths_mv fp ON all_fp.flow_id = fp.flow_id
WHERE fp.category = 'COMPANY'
GROUP BY (
  fp.node_id,
  fp.node,
  fp.node_type_id,
  fp.node_type,
  all_fp.country_id,
  all_fp.commodity_id,
  all_fp.node_id
)
ORDER BY fp.node_type, fp.node;
