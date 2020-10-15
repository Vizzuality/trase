SELECT
  nodes.id,
  contexts.id AS context_id,
  nodes.node_type_id,
  context_node_types.id AS context_node_type_id,
  nodes.main_id,
  nodes.is_unknown,
  node_properties.is_domestic_consumption,
  (UPPER(BTRIM(nodes.name)) = 'OTHER') AS is_aggregated,
  CASE
    WHEN flow_nodes.node_id IS NOT NULL OR UPPER(BTRIM(nodes.name)) = 'OTHER'
    THEN true
    ELSE false
  END AS has_flows,
  nodes.name,
  node_types.name AS node_type,
  geo_id,
  profiles.name::TEXT AS profile
FROM nodes
JOIN node_properties ON node_properties.node_id = nodes.id
JOIN node_types ON node_types.id = nodes.node_type_id
JOIN context_node_types ON context_node_types.node_type_id = node_types.id
JOIN contexts ON context_node_types.context_id = contexts.id
JOIN countries ON contexts.country_id = countries.id
JOIN context_node_type_properties ON context_node_type_properties.context_node_type_id = context_node_types.id
LEFT JOIN profiles ON profiles.context_node_type_id = context_node_types.id
LEFT OUTER JOIN (SELECT DISTINCT node_id, context_id FROM flow_nodes) flow_nodes
  ON flow_nodes.node_id = nodes.id
  AND flow_nodes.context_id = context_node_types.context_id
  AND flow_nodes.context_id = contexts.id
WHERE
  context_node_type_properties.is_visible
  AND (
    (
      flow_nodes.context_id IS NOT NULL
      AND flow_nodes.context_id = contexts.id
    ) OR (
      context_node_type_properties.is_geo_column
      AND UPPER(countries.iso2) = UPPER(SUBSTRING(geo_id FROM 1 FOR 2))
    ) OR UPPER(BTRIM(nodes.name)) = 'OTHER'
  );
