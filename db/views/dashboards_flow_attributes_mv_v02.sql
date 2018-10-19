SELECT DISTINCT
  contexts.country_id,
  contexts.commodity_id,
  flows.path,
  a.id AS attribute_id,
  a.display_name,
  a.tooltip_text,
  da.chart_type,
  da.dashboards_attribute_group_id,
  da.position
FROM flows
JOIN contexts ON flows.context_id = contexts.id
JOIN flow_inds ON flows.id = flow_inds.flow_id
JOIN dashboards_inds di ON flow_inds.ind_id = di.ind_id
JOIN dashboards_attributes da ON da.id = di.dashboards_attribute_id
JOIN attributes_mv a ON a.original_id = di.ind_id AND a.original_type = 'Ind'
WHERE a.display_name IS NOT NULL

UNION ALL

SELECT DISTINCT
  contexts.country_id,
  contexts.commodity_id,
  flows.path,
  a.id AS attribute_id,
  a.display_name,
  a.tooltip_text,
  da.chart_type,
  da.dashboards_attribute_group_id,
  da.position
FROM flows
JOIN contexts ON flows.context_id = contexts.id
JOIN flow_quals ON flows.id = flow_quals.flow_id
JOIN dashboards_quals dq ON flow_quals.qual_id = dq.qual_id
JOIN dashboards_attributes da ON da.id = dq.dashboards_attribute_id
JOIN attributes_mv a ON a.original_id = dq.qual_id AND a.original_type = 'Qual'
WHERE a.display_name IS NOT NULL

UNION ALL

SELECT DISTINCT
  contexts.country_id,
  contexts.commodity_id,
  flows.path,
  a.id AS attribute_id,
  a.display_name,
  a.tooltip_text,
  da.chart_type,
  da.dashboards_attribute_group_id,
  da.position
FROM flows
JOIN contexts ON flows.context_id = contexts.id
JOIN flow_quants ON flows.id = flow_quants.flow_id
JOIN dashboards_quants dq ON flow_quants.quant_id = dq.quant_id
JOIN dashboards_attributes da ON da.id = dq.dashboards_attribute_id
JOIN attributes_mv a ON a.original_id = dq.quant_id AND a.original_type = 'Quant'
WHERE a.display_name IS NOT NULL;
