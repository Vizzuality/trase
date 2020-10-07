SELECT
  -- fixed width first
  nodes.id,
  nodes.node_type_id,
  nodes.context_id,
  nodes.country_id,
  nodes.commodity_id,
  nodes.context_node_type_id,
  nodes.year,
  nodes.name,
  nodes.name_tsvector,
  nodes.node_type,
  profiles.name AS profile,
  ranked_nodes.rank_by_year
FROM nodes_with_flows_per_year nodes
JOIN node_properties node_props ON nodes.id = node_props.node_id
JOIN context_node_type_properties cnt_props ON nodes.context_node_type_id = cnt_props.context_node_type_id
LEFT JOIN profiles ON nodes.context_node_type_id = profiles.context_node_type_id
JOIN nodes_per_context_ranked_by_volume_per_year_mv ranked_nodes
  ON nodes.context_id = ranked_nodes.context_id
  AND nodes.id = ranked_nodes.node_id
WHERE
  cnt_props.role = 'destination'
  AND cnt_props.is_visible
  AND NOT nodes.is_unknown
  AND NOT node_props.is_domestic_consumption
  AND UPPER(nodes.name) <> 'OTHER';
