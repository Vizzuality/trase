SELECT * FROM (
  SELECT
    quants.id AS original_id,
    'Quant' AS original_type,
    quants.name,
    qp.display_name,
    quants.unit,
    qp.unit_type,
    qp.tooltip_text
  FROM quants
  LEFT JOIN quant_properties qp ON qp.quant_id = quants.id

  UNION ALL

  SELECT
    inds.id,
    'Ind',
    inds.name,
    ip.display_name,
    inds.unit,
    ip.unit_type,
    ip.tooltip_text
  FROM inds
  LEFT JOIN ind_properties ip ON ip.ind_id = inds.id

  UNION ALL

  SELECT
    quals.id,
    'Qual',
    quals.name,
    qp.display_name,
    NULL,
    NULL,
    qp.tooltip_text
  FROM quals
  LEFT JOIN qual_properties qp ON qp.qual_id = quals.id
) s;
