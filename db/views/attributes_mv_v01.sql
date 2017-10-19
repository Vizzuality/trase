SELECT ROW_NUMBER() OVER () AS id, * FROM (
  SELECT
    name,
    'Quant' AS type,
    id AS original_id,
    unit,
    unit_type,
    tooltip,
    tooltip_text,
    frontend_name,
    'SUM' AS aggregate_method,
    created_at,
    updated_at
  FROM quants

  UNION ALL

  SELECT
    name,
    'Ind',
    id AS original_id,
    unit,
    unit_type,
    tooltip,
    tooltip_text,
    frontend_name,
    'AVG' AS aggregate_method,
    created_at,
    updated_at
  FROM inds

  UNION ALL

  SELECT
    name,
    'Qual',
    id AS original_id,
    NULL,
    NULL,
    tooltip,
    tooltip_text,
    frontend_name,
    NULL,
    created_at,
    updated_at
  FROM quals
) s;
