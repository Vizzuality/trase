SELECT
  f.context_id,
  f.year,
  f.path,
  f.names,
  fi.original_type,
  fi.original_id,
  fi.name AS attribute_name,
  STRING_AGG(fi.text_value, ' / ') AS text_values,
  SUM(fi.numeric_value) AS sum,
  CASE
    WHEN fi.original_type = 'Qual' THEN STRING_AGG(DISTINCT fi.text_value, ' / ')
    ELSE SUM(fi.numeric_value)::TEXT
  END AS total
FROM partitioned_flows f
JOIN (
  SELECT
    f.flow_id, f.qual_id AS original_id, 'Qual' AS original_type,
    null AS numeric_value,
    value AS text_value,
    q.name,
    null AS unit
  FROM partitioned_flow_quals f
  JOIN quals q ON f.qual_id = q.id
--  GROUP BY f.flow_id, f.qual_id, f.value, q.name

  UNION ALL

  SELECT
    f.flow_id, f.quant_id, 'Quant',
    f.value,
    null,
    q.name,
    q.unit
  FROM partitioned_flow_quants f
  JOIN quants q ON f.quant_id = q.id
--  GROUP BY f.flow_id, f.quant_id, f.value, q.name, q.unit
) fi ON f.id = fi.flow_id
GROUP BY
  f.context_id,
  f.year,
  f.path,
  f.names,
  fi.original_type,
  fi.original_id,
  fi.name;
