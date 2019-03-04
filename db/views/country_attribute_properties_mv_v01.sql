SELECT id, country_id, tooltip_text, qual_id, -1 as ind_id, -1 as quant_id
FROM qual_country_properties

UNION ALL

SELECT id, country_id, tooltip_text, -1 as qual_id, -1 as ind_id, quant_id
FROM quant_country_properties

UNION ALL

SELECT id, country_id, tooltip_text, -1 as qual_id, ind_id, -1 as quant_id
FROM ind_country_properties
