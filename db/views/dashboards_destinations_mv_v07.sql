WITH active_cnt AS (
  SELECT context_id, column_position, cnt_props.role, profiles.name AS profile
  FROM context_node_types cnt
  JOIN context_node_type_properties cnt_props ON cnt.id = cnt_props.context_node_type_id
  LEFT JOIN profiles ON cnt.id = profiles.context_node_type_id
  WHERE cnt_props.role IS NOT NULL
), flow_nodes AS (
  SELECT
    flow_nodes.context_id,
    flow_id,
    node_id,
    position
  FROM (
    SELECT
      context_id,
      flow_id,
      node_id,
      position
    FROM flow_nodes_mv
  ) flow_nodes
  JOIN active_cnt ON flow_nodes.context_id = active_cnt.context_id
    AND flow_nodes.position = active_cnt.column_position + 1
), filtered_flow_nodes AS (
  SELECT
    -- fixed width first
    flow_nodes.flow_id,
    flow_nodes.node_id,
    nodes.node_type_id,
    contexts.country_id,
    contexts.commodity_id,
    TRIM(nodes.name) AS name,
    TO_TSVECTOR('simple', COALESCE(TRIM(nodes.name)::TEXT, '')) AS name_tsvector,
    node_types.name AS node_type,
    CASE
      -- this is the same condition as in nodes_mv
      WHEN nodes.is_unknown = FALSE AND node_properties.is_domestic_consumption = FALSE AND nodes.name NOT ILIKE 'OTHER'
      THEN cnt.profile
      ELSE NULL
    END AS profile
  FROM flow_nodes
  JOIN nodes ON nodes.id = flow_nodes.node_id
  JOIN node_properties ON nodes.id = node_properties.node_id
  JOIN node_types ON node_types.id = nodes.node_type_id
  JOIN active_cnt cnt ON cnt.context_id = flow_nodes.context_id
    AND cnt.column_position + 1 = flow_nodes.position
  JOIN contexts ON contexts.id = flow_nodes.context_id AND contexts.id = cnt.context_id
  WHERE cnt.role = 'destination'
)
SELECT
  -- fixed width first
  ffn.node_id AS id,
  ffn.node_type_id,
  ffn.country_id,
  ffn.commodity_id,
  fn.node_id,
  ffn.name,
  ffn.name_tsvector,
  ffn.node_type,
  ffn.profile
FROM filtered_flow_nodes ffn
JOIN flow_nodes fn
ON ffn.flow_id = fn.flow_id
WHERE ffn.node_id <> fn.node_id
GROUP BY (
  ffn.node_id,
  ffn.node_type_id,
  ffn.country_id,
  ffn.commodity_id,
  fn.node_id,
  ffn.name,
  ffn.name_tsvector,
  ffn.node_type,
  ffn.profile
);
