SELECT
  nodes.id,
  nodes.context_id,
  nodes.main_id,
  nodes.column_position,
  context_properties.is_subnational,
  TRIM(nodes.name),
  nodes.node_type,
  profiles.name AS profile,
  nodes.geo_id,
  context_node_type_properties.role,
  nodes.name_tsvector,
  ARRAY_AGG(DISTINCT year ORDER BY year)
FROM nodes_with_flows_per_year nodes
JOIN node_properties on nodes.id = node_properties.node_id
JOIN context_properties ON nodes.context_id = context_properties.context_id
JOIN context_node_type_properties ON nodes.context_node_type_id = context_node_type_properties.context_node_type_id
LEFT JOIN profiles ON nodes.context_node_type_id = profiles.context_node_type_id
WHERE NOT nodes.is_unknown AND NOT node_properties.is_domestic_consumption
GROUP BY
  nodes.id,
  nodes.context_id,
  nodes.main_id,
  nodes.column_position,
  context_properties.is_subnational,
  nodes.name,
  nodes.node_type,
  profiles.name,
  nodes.geo_id,
  context_node_type_properties.role,
  nodes.name_tsvector;
