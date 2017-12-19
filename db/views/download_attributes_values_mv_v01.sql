SELECT
  f.flow_id, f.qual_id AS attribute_id, 'Qual' AS attribute_type,
  null AS numeric_value,
  CASE
    WHEN LOWER(value) = 'yes' THEN true
    WHEN LOWER(value) = 'no' THEN false
    ELSE null
  END AS boolean_value,
  q.name,
  null AS unit,
  q.name AS name_with_unit,
  da.display_name,
  da.context_id
FROM flow_quals f
JOIN quals q ON f.qual_id = q.id
JOIN download_quals dq ON dq.qual_id = q.id
JOIN download_attributes da ON dq.download_attribute_id = da.id
GROUP BY f.flow_id, f.qual_id, f.value, q.name, da.display_name, da.context_id

UNION ALL

SELECT
  f.flow_id, f.quant_id, 'Quant',
  f.value,
  null,
  q.name,
  q.unit,
  CASE
    WHEN unit IS null THEN q.name
    ELSE q.name || ' (' || q.unit || ')'
  END,
  da.display_name,
  da.context_id
FROM flow_quants f
JOIN quants q ON f.quant_id = q.id
JOIN download_quants dq ON dq.quant_id = q.id
JOIN download_attributes da ON dq.download_attribute_id = da.id
GROUP BY f.flow_id, f.quant_id, f.value, q.name, q.unit, da.display_name, da.context_id;
