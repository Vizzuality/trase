SELECT ROW_NUMBER() OVER () AS id, * FROM (
  SELECT
    'Quant' AS original_type,
    id AS original_id,
    name,
    display_name,
    unit,
    unit_type,
    tooltip,
    tooltip_text,
    'SUM' AS aggregate_method,
    created_at,
    updated_at
  FROM quants

  UNION ALL

  SELECT
    'Ind',
    id,
    name,
    display_name,
    unit,
    unit_type,
    tooltip,
    tooltip_text,
    'AVG',
    created_at,
    updated_at
  FROM inds

  UNION ALL

  SELECT
    'Qual',
    id,
    name,
    display_name,
    NULL,
    NULL,
    tooltip,
    tooltip_text,
    NULL,
    created_at,
    updated_at
  FROM quals
) s;
