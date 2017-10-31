SELECT ROW_NUMBER() OVER () AS id, * FROM (
  SELECT
    'Quant' AS type,
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
    id AS original_id,
    name,
    display_name,
    unit,
    unit_type,
    tooltip,
    tooltip_text,
    'AVG' AS aggregate_method,
    created_at,
    updated_at
  FROM inds

  UNION ALL

  SELECT
    'Qual',
    id AS original_id,
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
