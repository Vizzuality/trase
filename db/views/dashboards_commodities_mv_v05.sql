SELECT
  commodity_id AS id,
  fp.country_id,
  fp.node_id,
  TRIM(commodities.name) AS name,
  TO_TSVECTOR('simple', COALESCE(TRIM(commodities.name)::TEXT, '')) AS name_tsvector,
  fp.profile
FROM (
  SELECT
    commodity_id,
    country_id,
    node_id,
    profiles.name AS profile
  FROM (
    SELECT DISTINCT
      context_id,
      node_id,
      position
    FROM flow_nodes_mv
  ) flow_nodes
  JOIN contexts ON contexts.id = flow_nodes.context_id
  JOIN context_node_types cnt ON cnt.context_id = flow_nodes.context_id
    AND cnt.context_id = contexts.id
    AND cnt.column_position + 1 = flow_nodes.position
  JOIN context_node_type_properties cnt_props ON cnt_props.context_node_type_id = cnt.id
  LEFT JOIN profiles ON cnt.id = profiles.context_node_type_id
  WHERE cnt_props.role IS NOT NULL
  GROUP BY (commodity_id, country_id, node_id, profiles.name)
) fp
JOIN commodities ON commodities.id = fp.commodity_id;
