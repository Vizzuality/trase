SELECT ROW_NUMBER() OVER () AS id, * FROM (
  SELECT
    'Quant' AS original_type,
    quants.id AS original_id,
    quants.name,
    qp.display_name,
    quants.unit,
    qp.unit_type,
    qp.tooltip_text,
    qp.is_visible_on_actor_profile,
    qp.is_visible_on_place_profile,
    qp.is_temporal_on_actor_profile,
    qp.is_temporal_on_place_profile,
    'SUM' AS aggregate_method
  FROM quants
  LEFT JOIN quant_properties qp ON qp.quant_id = quants.id

  UNION ALL

  SELECT
    'Ind',
    inds.id,
    inds.name,
    ip.display_name,
    inds.unit,
    ip.unit_type,
    ip.tooltip_text,
    ip.is_visible_on_actor_profile,
    ip.is_visible_on_place_profile,
    ip.is_temporal_on_actor_profile,
    ip.is_temporal_on_place_profile,
    'AVG'
  FROM inds
  LEFT JOIN ind_properties ip ON ip.ind_id = inds.id

  UNION ALL

  SELECT
    'Qual',
    quals.id,
    quals.name,
    qp.display_name,
    NULL,
    NULL,
    qp.tooltip_text,
    qp.is_visible_on_actor_profile,
    qp.is_visible_on_place_profile,
    qp.is_temporal_on_actor_profile,
    qp.is_temporal_on_place_profile,
    NULL
  FROM quals
  LEFT JOIN qual_properties qp ON qp.qual_id = quals.id
) s;
