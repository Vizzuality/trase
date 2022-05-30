SELECT
  nodes.id,
  nodes.context_id,
  nodes.country_id,
  nodes.commodity_id,
  nodes.node_type_id,
  nodes.context_node_type_id,
  nodes.main_id,
  nodes.column_position,
  CASE WHEN context_properties.subnational_years IS NOT NULL AND ICOUNT(context_properties.subnational_years) > 0 THEN TRUE ELSE FALSE END AS is_subnational,
  nodes.is_unknown,
  node_properties.is_domestic_consumption,
  TRIM(nodes.name) AS name,
  nodes.node_type,
  profiles.name AS profile,
  nodes.geo_id,
  context_node_type_properties.role,
  nodes.name_tsvector,
  ARRAY_AGG(DISTINCT year ORDER BY year),
  NULL::JSON AS actor_basic_attributes
FROM nodes_with_flows_per_year nodes
JOIN node_properties on nodes.id = node_properties.node_id
JOIN contexts ON nodes.context_id = contexts.id
JOIN context_properties ON nodes.context_id = context_properties.context_id
JOIN context_node_type_properties ON nodes.context_node_type_id = context_node_type_properties.context_node_type_id
LEFT JOIN profiles ON nodes.context_node_type_id = profiles.context_node_type_id
WHERE NOT context_properties.is_disabled
GROUP BY
  nodes.id,
  nodes.context_id,
  nodes.country_id,
  nodes.commodity_id,
  nodes.node_type_id,
  nodes.context_node_type_id,
  nodes.main_id,
  nodes.column_position,
  context_properties.subnational_years,
  nodes.is_unknown,
  node_properties.is_domestic_consumption,
  TRIM(nodes.name),
  nodes.node_type,
  profiles.name,
  nodes.geo_id,
  context_node_type_properties.role,
  nodes.name_tsvector;
