WITH all_flow_nodes AS (
  SELECT
    -- fixed width first
    flow_nodes.flow_id,
    flow_nodes.node_id,
    flow_nodes.context_id,
    nodes.node_type_id,
    TRIM(nodes.name) AS name,
    cnt_props.role,
    profiles.name AS profile
  FROM flow_nodes_mv flow_nodes
  JOIN nodes ON flow_nodes.node_id = nodes.id
  JOIN node_properties ON nodes.id = node_properties.node_id
  JOIN context_node_types cnt ON flow_nodes.context_id = cnt.context_id
    AND flow_nodes.position = cnt.column_position + 1
    AND nodes.node_type_id = cnt.node_type_id
  JOIN context_node_type_properties cnt_props ON cnt.id = cnt_props.context_node_type_id
  LEFT JOIN profiles ON cnt.id = profiles.context_node_type_id
  -- exclude unknowns and other placeholders; this mview is for filtering only
  WHERE nodes.is_unknown = FALSE
    AND node_properties.is_domestic_consumption = FALSE
    AND nodes.name NOT ILIKE 'OTHER'
), filtered_flow_nodes AS (
  SELECT
    -- fixed width first
    flow_nodes.flow_id,
    flow_nodes.node_id,
    flow_nodes.context_id,
    flow_nodes.node_type_id,
    contexts.country_id,
    contexts.commodity_id,
    flow_nodes.name,
    TO_TSVECTOR('simple', COALESCE(flow_nodes.name, '')) AS name_tsvector,
    node_types.name AS node_type,
    profile,
    ranked_nodes.rank_by_year
  FROM all_flow_nodes flow_nodes
  JOIN node_types ON node_types.id = flow_nodes.node_type_id
  JOIN contexts ON contexts.id = flow_nodes.context_id
  JOIN nodes_per_context_ranked_by_volume_per_year_mv ranked_nodes
    ON flow_nodes.context_id = ranked_nodes.context_id
    AND flow_nodes.node_id = ranked_nodes.node_id
  WHERE role = 'source'
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
  ffn.profile,
  ffn.rank_by_year
FROM filtered_flow_nodes ffn
JOIN all_flow_nodes fn
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
  ffn.profile,
  ffn.rank_by_year
);
