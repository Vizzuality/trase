SELECT DISTINCT
  --contexts.country_id,
  --contexts.commodity_id,
  node_inds.node_id,
  a.id AS attribute_id,
  a.display_name,
  a.tooltip_text,
  da.chart_type,
  da.dashboards_attribute_group_id,
  da.position
FROM node_inds
--JOIN nodes ON node_inds.node_id = nodes.id
--JOIN context_node_types ON nodes.node_type_id = context_node_types.node_type_id
--JOIN contexts ON context_node_types.context_id = contexts.id
JOIN dashboards_inds di ON node_inds.ind_id = di.ind_id
JOIN dashboards_attributes da ON da.id = di.dashboards_attribute_id
JOIN attributes_mv a ON a.original_id = di.ind_id AND a.original_type = 'Ind'
WHERE a.display_name IS NOT NULL

UNION ALL

SELECT DISTINCT
  --contexts.country_id,
  --contexts.commodity_id,
  node_quals.node_id,
  a.id AS attribute_id,
  a.display_name,
  a.tooltip_text,
  da.chart_type,
  da.dashboards_attribute_group_id,
  da.position
FROM node_quals
--JOIN nodes ON node_quals.node_id = nodes.id
--JOIN context_node_types ON nodes.node_type_id = context_node_types.node_type_id
--JOIN contexts ON context_node_types.context_id = contexts.id
JOIN dashboards_quals dq ON node_quals.qual_id = dq.qual_id
JOIN dashboards_attributes da ON da.id = dq.dashboards_attribute_id
JOIN attributes_mv a ON a.original_id = dq.qual_id AND a.original_type = 'Qual'
WHERE a.display_name IS NOT NULL

UNION ALL

SELECT DISTINCT
  --contexts.country_id,
  --contexts.commodity_id,
  node_quants.node_id,
  a.id AS attribute_id,
  a.display_name,
  a.tooltip_text,
  da.chart_type,
  da.dashboards_attribute_group_id,
  da.position
FROM node_quants
--JOIN nodes ON node_quants.node_id = nodes.id
--JOIN context_node_types ON nodes.node_type_id = context_node_types.node_type_id
--JOIN contexts ON context_node_types.context_id = contexts.id
JOIN dashboards_quants dq ON node_quants.quant_id = dq.quant_id
JOIN dashboards_attributes da ON da.id = dq.dashboards_attribute_id
JOIN attributes_mv a ON a.original_id = dq.quant_id AND a.original_type = 'Quant'
WHERE a.display_name IS NOT NULL;
