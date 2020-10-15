SELECT
  ma.id,
  a.id AS attribute_id,
  mag.context_id,
  ma.map_attribute_group_id,
  a.original_id AS original_attribute_id,
  ma.position::SMALLINT,
  ma.is_disabled,
  ma.is_default,
  ma.years,
  ma.dual_layer_buckets,
  ma.single_layer_buckets,
  ma.color_scale,
  a.display_name AS name,
  'quant'::text AS attribute_type,
  a.unit,
  a.tooltip_text AS description
FROM map_quants maq
JOIN map_attributes ma ON ma.id = maq.map_attribute_id
JOIN map_attribute_groups mag ON mag.id = ma.map_attribute_group_id
JOIN attributes a ON a.original_id = maq.quant_id AND a.original_type = 'Quant'

UNION ALL

SELECT
  ma.id,
  a.id AS attribute_id,
  mag.context_id,
  ma.map_attribute_group_id,
  a.original_id AS original_attribute_id,
  ma.position::SMALLINT,
  ma.is_disabled,
  ma.is_default,
  ma.years,
  ma.dual_layer_buckets,
  ma.single_layer_buckets,
  ma.color_scale,
  a.display_name AS name,
  'ind'::text AS attribute_type,
  a.unit,
  a.tooltip_text AS description
FROM map_inds mai
JOIN map_attributes ma ON ma.id = mai.map_attribute_id
JOIN map_attribute_groups mag ON mag.id = ma.map_attribute_group_id
JOIN attributes a ON a.original_id = mai.ind_id AND a.original_type = 'Ind'
