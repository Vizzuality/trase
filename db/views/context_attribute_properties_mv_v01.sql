SELECT id, context_id, tooltip_text, qual_id, -1 as ind_id, -1 as quant_id
FROM qual_context_properties

UNION ALL

SELECT id, context_id, tooltip_text, -1 as qual_id, -1 as ind_id, quant_id
FROM quant_context_properties

UNION ALL

SELECT id, context_id, tooltip_text, -1 as qual_id, ind_id, -1 as quant_id
FROM ind_context_properties
