SELECT * FROM (
  SELECT
    quants.id AS original_id,
    'Quant' AS original_type,
    quants.name,
    qp.display_name,
    quants.unit,
    qp.unit_type,
    qp.tooltip_text,
    context_p.tooltip_text_by_context_id,
    country_p.tooltip_text_by_country_id,
    commodity_p.tooltip_text_by_commodity_id,
    context_p.display_name_by_context_id,
    country_p.display_name_by_country_id,
    commodity_p.display_name_by_commodity_id
  FROM quants
  LEFT JOIN quant_properties qp ON qp.quant_id = quants.id
  LEFT JOIN (
    SELECT
      quant_id,
      JSONB_OBJECT_AGG(context_id, tooltip_text) AS tooltip_text_by_context_id,
      JSONB_OBJECT_AGG(context_id, display_name) AS display_name_by_context_id
    FROM quant_context_properties
    GROUP BY quant_id
  ) context_p ON quants.id = context_p.quant_id
  LEFT JOIN (
    SELECT
      quant_id,
      JSONB_OBJECT_AGG(country_id, tooltip_text) AS tooltip_text_by_country_id,
      JSONB_OBJECT_AGG(country_id, display_name) AS display_name_by_country_id
    FROM quant_country_properties
    GROUP BY quant_id
  ) country_p ON quants.id = country_p.quant_id
  LEFT JOIN (
    SELECT
      quant_id,
      JSONB_OBJECT_AGG(commodity_id, tooltip_text) AS tooltip_text_by_commodity_id,
      JSONB_OBJECT_AGG(commodity_id, display_name) AS display_name_by_commodity_id
    FROM quant_commodity_properties
    GROUP BY quant_id
  ) commodity_p ON quants.id = commodity_p.quant_id

  UNION ALL

  SELECT
    inds.id,
    'Ind',
    inds.name,
    ip.display_name,
    inds.unit,
    ip.unit_type,
    ip.tooltip_text,
    context_p.tooltip_text_by_context_id,
    country_p.tooltip_text_by_country_id,
    commodity_p.tooltip_text_by_commodity_id,
    context_p.display_name_by_context_id,
    country_p.display_name_by_country_id,
    commodity_p.display_name_by_commodity_id
  FROM inds
  LEFT JOIN ind_properties ip ON ip.ind_id = inds.id
  LEFT JOIN (
    SELECT
      ind_id,
      JSONB_OBJECT_AGG(context_id, tooltip_text) AS tooltip_text_by_context_id,
      JSONB_OBJECT_AGG(context_id, display_name) AS display_name_by_context_id
    FROM ind_context_properties
    GROUP BY ind_id
  ) context_p ON inds.id = context_p.ind_id
  LEFT JOIN (
    SELECT
      ind_id,
      JSONB_OBJECT_AGG(country_id, tooltip_text) AS tooltip_text_by_country_id,
      JSONB_OBJECT_AGG(country_id, display_name) AS display_name_by_country_id
    FROM ind_country_properties
    GROUP BY ind_id
  ) country_p ON inds.id = country_p.ind_id
  LEFT JOIN (
    SELECT
      ind_id,
      JSONB_OBJECT_AGG(commodity_id, tooltip_text) AS tooltip_text_by_commodity_id,
      JSONB_OBJECT_AGG(commodity_id, display_name) AS display_name_by_commodity_id
    FROM ind_commodity_properties
    GROUP BY ind_id
  ) commodity_p ON inds.id = commodity_p.ind_id

  UNION ALL

  SELECT
    quals.id,
    'Qual',
    quals.name,
    qp.display_name,
    NULL,
    NULL,
    qp.tooltip_text,
    context_p.tooltip_text_by_context_id,
    country_p.tooltip_text_by_country_id,
    commodity_p.tooltip_text_by_commodity_id,
    context_p.display_name_by_context_id,
    country_p.display_name_by_country_id,
    commodity_p.display_name_by_commodity_id
  FROM quals
  LEFT JOIN qual_properties qp ON qp.qual_id = quals.id
  LEFT JOIN (
    SELECT
      qual_id,
      JSONB_OBJECT_AGG(context_id, tooltip_text) AS tooltip_text_by_context_id,
      JSONB_OBJECT_AGG(context_id, display_name) AS display_name_by_context_id
    FROM qual_context_properties
    GROUP BY qual_id
  ) context_p ON quals.id = context_p.qual_id
  LEFT JOIN (
    SELECT
      qual_id,
      JSONB_OBJECT_AGG(country_id, tooltip_text) AS tooltip_text_by_country_id,
      JSONB_OBJECT_AGG(country_id, display_name) AS display_name_by_country_id
    FROM qual_country_properties
    GROUP BY qual_id
  ) country_p ON quals.id = country_p.qual_id
  LEFT JOIN (
    SELECT
      qual_id,
      JSONB_OBJECT_AGG(commodity_id, tooltip_text) AS tooltip_text_by_commodity_id,
      JSONB_OBJECT_AGG(commodity_id, display_name) AS display_name_by_commodity_id
    FROM qual_commodity_properties
    GROUP BY qual_id
  ) commodity_p ON quals.id = commodity_p.qual_id
) s;
