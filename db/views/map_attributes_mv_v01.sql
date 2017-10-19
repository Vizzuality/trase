SELECT ma.*, a.id AS attribute_id
FROM map_quants maq
JOIN map_attributes ma ON ma.id = maq.map_attribute_id
JOIN attributes_mv a ON a.original_id = maq.quant_id AND a.type = 'Quant'

UNION ALL

SELECT ma.*, a.id AS attribute_id
FROM map_inds mai
JOIN map_attributes ma ON ma.id = mai.map_attribute_id
JOIN attributes_mv a ON a.original_id = mai.ind_id AND a.type = 'Ind'
