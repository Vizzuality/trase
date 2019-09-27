SELECT ma.*, a.id AS attribute_id, a.display_name as name, 'quant' as attribute_type, a.unit as unit,
  tooltip_text as description, a.original_id as original_attribute_id,
  mag.context_id
FROM map_quants maq
JOIN map_attributes ma ON ma.id = maq.map_attribute_id
JOIN map_attribute_groups mag ON mag.id = ma.map_attribute_group_id
JOIN attributes a ON a.original_id = maq.quant_id AND a.original_type = 'Quant'

UNION ALL

SELECT ma.*, a.id AS attribute_id, a.display_name as name, 'ind' as attribute_type, a.unit as unit,
  tooltip_text as description, a.original_id as original_attribute_id,
  mag.context_id
FROM map_inds mai
JOIN map_attributes ma ON ma.id = mai.map_attribute_id
JOIN map_attribute_groups mag ON mag.id = ma.map_attribute_group_id
JOIN attributes a ON a.original_id = mai.ind_id AND a.original_type = 'Ind'
