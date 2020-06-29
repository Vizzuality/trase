SELECT DISTINCT
  commodity_id AS id,
  country_id,
  nodes.id AS node_id,
  nodes.context_node_type_id,
  year,
  TRIM(commodities.name) AS name,
  TO_TSVECTOR('simple', COALESCE(TRIM(commodities.name)::TEXT, '')) AS name_tsvector,
  profiles.name AS profile
FROM nodes_with_flows_per_year nodes
JOIN commodities ON commodities.id = commodity_id
JOIN context_properties ON context_properties.context_id = nodes.context_id
LEFT JOIN profiles ON nodes.context_node_type_id = profiles.context_node_type_id
WHERE NOT is_unknown AND NOT context_properties.is_disabled;
