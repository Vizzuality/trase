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
  q.name  AS name_with_unit
FROM flow_quals f
JOIN quals q ON f.qual_id = q.qual_id
WHERE name IN ('ZERO_DEFORESTATION')
GROUP BY f.flow_id, f.qual_id, f.value, q.name

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
  END AS name_with_unit
FROM flow_inds f
JOIN inds i ON f.ind_id = i.ind_id
WHERE name IN ('BIODIVERSITY', 'FOREST_500', 'SMALLHOLDERS', 'WATER_SCARCITY', 'COMPLIANCE_FOREST_CODE')
GROUP BY f.flow_id, f.ind_id, f.value, i.name, i.unit

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
  END
FROM flow_quants f
JOIN quants q ON f.quant_id = q.quant_id
WHERE name IN ('AGROSATELITE_SOY_DEFOR_', 'GHG', 'POTENTIAL_SOY_RELATED_DEFOR', 'SOY_', 'TOTAL_DEFOR_RATE')
GROUP BY f.flow_id, f.quant_id, f.value, q.name, q.unit;
