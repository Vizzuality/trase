SELECT ra.*, a.id AS attribute_id, ARRAY[]::TEXT[] AS legend
FROM recolor_by_inds rai
JOIN recolor_by_attributes ra ON ra.id = rai.recolor_by_attribute_id
JOIN attributes a ON a.original_id = rai.ind_id AND a.original_type = 'Ind'

UNION ALL

SELECT ra.*, a.id AS attribute_id, ARRAY_AGG(DISTINCT flow_quals.value)
FROM recolor_by_quals raq
JOIN recolor_by_attributes ra ON ra.id = raq.recolor_by_attribute_id
JOIN attributes a ON a.original_id = raq.qual_id AND a.original_type = 'Qual'
JOIN flow_quals ON flow_quals.qual_id = raq.qual_id
JOIN flows ON flow_quals.flow_id = flows.id AND flows.context_id = ra.context_id
WHERE value NOT LIKE 'UNKNOWN%'
GROUP BY ra.id, a.id
