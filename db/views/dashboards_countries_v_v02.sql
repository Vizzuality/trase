SELECT DISTINCT
  country_id AS id,
  commodity_id,
  nodes.id AS node_id,
  iso2,
  TRIM(countries.name) AS name,
  TO_TSVECTOR('simple', COALESCE(TRIM(countries.name)::TEXT, '')) AS name_tsvector,
  profiles.name AS profile
FROM nodes_with_flows_per_year nodes
JOIN countries ON countries.id = country_id
LEFT JOIN profiles ON nodes.context_node_type_id = profiles.context_node_type_id
WHERE NOT is_unknown;
