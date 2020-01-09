SELECT
  context_id,
  year,
  quant_id AS attribute_id,
  'Quant' AS attribute_type,
  value AS quant_value,
  NULL AS qual_value,
  value::TEXT AS total,
  row_name,
  path,
  names
FROM partitioned_denormalised_flow_quants

UNION ALL

SELECT
  context_id,
  year,
  qual_id AS attribute_id,
  'Qual' AS attribute_type,
  NULL,
  value,
  value,
  row_name,
  path,
  names
FROM partitioned_denormalised_flow_quals;
