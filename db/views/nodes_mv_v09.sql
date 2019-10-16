SELECT
  nodes.id,
  nodes.main_id,
  nodes_with_flows.context_id,
  context_node_types.column_position,
  context_properties.is_subnational AS is_subnational,
  TRIM(nodes.name) AS name,
  TO_TSVECTOR('simple', COALESCE(TRIM(nodes.name)::TEXT, '')) AS name_tsvector,
  node_types.name AS node_type,
  profiles.name AS profile,
  UPPER(TRIM(nodes.geo_id)) AS geo_id,
  context_node_type_properties.role,
  nodes_with_flows.years
FROM nodes
JOIN (
  SELECT (UNNEST(path)) AS node_id, context_id, ARRAY_AGG(DISTINCT year ORDER BY year) AS years
  FROM flows
  GROUP BY UNNEST(path), context_id
) nodes_with_flows ON nodes.id = nodes_with_flows.node_id
JOIN node_types ON node_types.id = nodes.node_type_id
JOIN node_properties on nodes.id = node_properties.node_id
JOIN context_node_types ON context_node_types.node_type_id = node_types.id AND context_node_types.context_id = nodes_with_flows.context_id
JOIN context_properties ON context_node_types.context_id = context_properties.context_id
JOIN context_node_type_properties ON context_node_type_properties.context_node_type_id = context_node_types.id
LEFT JOIN profiles ON profiles.context_node_type_id = context_node_types.id
WHERE nodes.is_unknown = FALSE AND node_properties.is_domestic_consumption = FALSE AND nodes.name NOT ILIKE 'OTHER';
