SELECT
  cha.id,
  cha.chart_id,
  cha.position,
  cha.years,
  COALESCE(NULLIF(cha.display_name, ''), NULLIF(a.display_name, '')) AS display_name,
  cha.legend_name,
  cha.display_type,
  cha.display_style,
  cha.state_average,
  cha.identifier,
  a.name,
  a.unit,
  a.tooltip_text,
  a.id AS attribute_id,
  a.original_id,
  a.original_type,
  cha.created_at,
  cha.updated_at
FROM chart_quals chq
JOIN chart_attributes cha ON cha.id = chq.chart_attribute_id
JOIN attributes a ON a.original_id = chq.qual_id AND a.original_type = 'Qual'

UNION ALL

SELECT
  cha.id,
  cha.chart_id,
  cha.position,
  cha.years,
  COALESCE(NULLIF(cha.display_name, ''), NULLIF(a.display_name, '')),
  cha.legend_name,
  cha.display_type,
  cha.display_style,
  cha.state_average,
  cha.identifier,
  a.name,
  a.unit,
  a.tooltip_text,
  a.id,
  a.original_id,
  a.original_type,
  cha.created_at,
  cha.updated_at
FROM chart_quants chq
JOIN chart_attributes cha ON cha.id = chq.chart_attribute_id
JOIN attributes a ON a.original_id = chq.quant_id AND a.original_type = 'Quant'

UNION ALL

SELECT
  cha.id,
  cha.chart_id,
  cha.position,
  cha.years,
  COALESCE(NULLIF(cha.display_name, ''), NULLIF(a.display_name, '')),
  cha.legend_name,
  cha.display_type,
  cha.display_style,
  cha.state_average,
  cha.identifier,
  a.name,
  a.unit,
  a.tooltip_text,
  a.id,
  a.original_id,
  a.original_type,
  cha.created_at,
  cha.updated_at
FROM chart_inds chi
JOIN chart_attributes cha ON cha.id = chi.chart_attribute_id
JOIN attributes a ON a.original_id = chi.ind_id AND a.original_type = 'Ind'
