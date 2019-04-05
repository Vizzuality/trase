SELECT
  f.id,
  f.context_id,
  f.year,
  f.path,
  f.jsonb_path,
  fi.original_type,
  fi.original_id,
  fi.name AS attribute_name,
  STRING_AGG(fi.text_value, ' / ') AS text_values,
  SUM(fi.numeric_value) AS sum,
  CASE
    WHEN fi.original_type = 'Qual' THEN STRING_AGG(fi.text_value, ' / ')
    ELSE SUM(fi.numeric_value)::TEXT
  END AS total
FROM flows_mv f
JOIN (
  SELECT
    f.flow_id, f.qual_id AS original_id, 'Qual' AS original_type,
    null AS numeric_value,
    value AS text_value,
    q.name,
    null AS unit
  FROM flow_quals f
  JOIN quals q ON f.qual_id = q.id
  GROUP BY f.flow_id, f.qual_id, f.value, q.name

  UNION ALL

  SELECT
    f.flow_id, f.quant_id, 'Quant',
    f.value,
    null,
    q.name,
    q.unit
  FROM flow_quants f
  JOIN quants q ON f.quant_id = q.id
  GROUP BY f.flow_id, f.quant_id, f.value, q.name, q.unit
) fi ON f.id = fi.flow_id
GROUP BY
  f.id,
  f.context_id,
  f.year,
  f.path,
  f.jsonb_path,
  fi.original_type,
  fi.original_id,
  fi.name;
  