WITH all_attributes (
  id, display_name, tooltip_text, chart_type, dashboards_attribute_group_id, position, original_id, original_type
) AS (
  SELECT
    a.id,
    a.display_name,
    a.tooltip_text,
    da.chart_type,
    da.dashboards_attribute_group_id,
    da.position,
    a.original_id,
    a.original_type
  FROM dashboards_attributes_mv da
  JOIN attributes_mv a ON a.id = da.attribute_id
), combinations (flow_id, original_id, original_type) AS (
  SELECT DISTINCT flow_id, ind_id, 'Ind' FROM flow_inds
  UNION ALL
  SELECT DISTINCT flow_id, qual_id, 'Qual' FROM flow_quals
  UNION ALL
  SELECT DISTINCT flow_id, quant_id, 'Quant' FROM flow_quants
)
SELECT DISTINCT
  contexts.country_id,
  contexts.commodity_id,
  flows.path,
  all_attributes.id AS attribute_id,
  display_name,
  tooltip_text,
  chart_type,
  dashboards_attribute_group_id,
  position
FROM all_attributes
JOIN combinations ON all_attributes.original_id = combinations.original_id
  AND all_attributes.original_type = combinations.original_type
JOIN flows ON combinations.flow_id = flows.id
JOIN contexts ON flows.context_id = contexts.id
group by country_id, commodity_id, path, attribute_id, display_name, tooltip_text, chart_type, dashboards_attribute_group_id, position;
