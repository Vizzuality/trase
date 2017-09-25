SELECT
  f.flow_id, f.qual_id AS indicator_id, 'Qual' AS indicator_type,
  null AS numeric_value,
  CASE
    WHEN LOWER(value) = 'yes' THEN true
    WHEN LOWER(value) = 'no' THEN false
    ELSE null
  END AS boolean_value,
  q.name,
  null AS unit,
  q.name AS name_with_unit,
  ci.name_in_download,
  ci.context_id
FROM flow_quals f
JOIN quals q ON f.qual_id = q.qual_id
JOIN context_indicators ci ON ci.indicator_attribute_type = 'Qual' AND ci.indicator_attribute_id = q.qual_id
GROUP BY f.flow_id, f.qual_id, f.value, q.name, ci.name_in_download, ci.context_id

UNION ALL

SELECT
  f.flow_id, f.ind_id AS indicator_id, 'Ind' AS indicator_type,
  f.value,
  null,
  i.name,
  i.unit,
  CASE
    WHEN unit IS null THEN i.name
    ELSE i.name || ' (' || i.unit || ')'
  END AS name_with_unit,
  ci.name_in_download,
  ci.context_id
FROM flow_inds f
JOIN inds i ON f.ind_id = i.ind_id
JOIN context_indicators ci ON ci.indicator_attribute_type = 'Ind' AND ci.indicator_attribute_id = i.ind_id
GROUP BY f.flow_id, f.ind_id, f.value, i.name, i.unit, ci.name_in_download, ci.context_id

UNION ALL

SELECT
  f.flow_id, f.quant_id AS indicator_id, 'Quant' AS indicator_type,
  f.value,
  null,
  q.name,
  q.unit,
  CASE
    WHEN unit IS null THEN q.name
    ELSE q.name || ' (' || q.unit || ')'
  END,
  ci.name_in_download,
  ci.context_id
FROM flow_quants f
JOIN quants q ON f.quant_id = q.quant_id
JOIN context_indicators ci ON ci.indicator_attribute_type = 'Quant' AND ci.indicator_attribute_id = q.quant_id
GROUP BY f.flow_id, f.quant_id, f.value, q.name, q.unit, ci.name_in_download, ci.context_id;
