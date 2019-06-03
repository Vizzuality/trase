SELECT
  nodes.id,
  nodes.main_id,
  nodes.name,
  geo_id,
  CASE
    WHEN context_node_type_properties.is_geo_column
    THEN SUBSTRING(geo_id FROM 1 FOR 2)
    ELSE NULL
  END AS source_country_iso2,
  NULLIF(node_properties.is_domestic_consumption, FALSE) AS is_domestic_consumption,
  NULLIF(nodes.is_unknown, FALSE) AS is_unknown,
  nodes.node_type_id AS node_type_id,
  node_types.name AS node_type,
  profiles.name::TEXT AS profile_type,
  CASE
    WHEN nodes_with_flows.node_id IS NOT NULL OR nodes.name = 'OTHER'
    THEN true
    ELSE false
  END AS has_flows,
  (UPPER(BTRIM(nodes.name)) = 'OTHER') AS is_aggregated,
  context_node_types.context_id
FROM nodes
INNER JOIN node_properties ON node_properties.node_id = nodes.id
INNER JOIN node_types ON node_types.id = nodes.node_type_id
INNER JOIN context_node_types ON context_node_types.node_type_id = node_types.id
INNER JOIN context_node_type_properties ON context_node_type_properties.context_node_type_id = context_node_types.id
LEFT JOIN profiles ON profiles.context_node_type_id = context_node_types.id
LEFT OUTER JOIN (
  SELECT
  DISTINCT(UNNEST(path)) AS node_id, context_id
  FROM flows
) nodes_with_flows ON nodes_with_flows.node_id = nodes.id AND nodes_with_flows.context_id = context_node_types.context_id;
