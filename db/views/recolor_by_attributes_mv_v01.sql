SELECT ra.*, a.id AS attribute_id
FROM recolor_by_inds rai
JOIN recolor_by_attributes ra ON ra.id = rai.recolor_by_attribute_id
JOIN attributes_mv a ON a.original_id = rai.ind_id AND a.type = 'Ind'

UNION ALL

SELECT ra.*, a.id AS attribute_id
FROM recolor_by_quals raq
JOIN recolor_by_attributes ra ON ra.id = raq.recolor_by_attribute_id
JOIN attributes_mv a ON a.original_id = raq.qual_id AND a.type = 'Qual'
