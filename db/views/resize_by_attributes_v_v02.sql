SELECT
  ra.id,
  ra.parent_id,
  a.id AS attribute_id,
  parent_a.id AS parent_attribute_id,
  ra.context_id,
  ra.group_number::SMALLINT,
  ra.position::SMALLINT,
  ra.years::SMALLINT[],
  ra.is_disabled,
  ra.is_default,
  ra.is_quick_fact,
  ra.tooltip_text
FROM resize_by_attributes ra
JOIN resize_by_quants raq ON ra.id = raq.resize_by_attribute_id
JOIN attributes a ON a.original_id = raq.quant_id AND a.original_type = 'Quant'
LEFT JOIN resize_by_attributes parent_ra ON parent_ra.id = ra.parent_id
LEFT JOIN resize_by_quants parent_raq ON parent_raq.resize_by_attribute_id = parent_ra.id
LEFT JOIN attributes parent_a ON parent_a.original_id = parent_raq.quant_id AND parent_a.original_type = 'Quant';

