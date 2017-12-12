SELECT ma.*, a.id AS attribute_id, a.display_name as name, 'quant' as attribute_type, a.unit as unit,
  tooltip_text as description, a.aggregate_method as aggregate_method, a.original_id as layer_attribute_id
FROM map_quants maq
JOIN map_attributes ma ON ma.id = maq.map_attribute_id
JOIN attributes_mv a ON a.original_id = maq.quant_id AND a.original_type = 'Quant'

UNION ALL

SELECT ma.*, a.id AS attribute_id, a.display_name as name, 'ind' as attribute_type, a.unit as unit,
  tooltip_text as description, a.aggregate_method as aggregate_method, a.original_id as layer_attribute_id
FROM map_inds mai
JOIN map_attributes ma ON ma.id = mai.map_attribute_id
JOIN attributes_mv a ON a.original_id = mai.ind_id AND a.original_type = 'Ind'
