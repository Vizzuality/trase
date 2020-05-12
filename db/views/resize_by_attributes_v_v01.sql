SELECT
  ra.id,
  a.id AS attribute_id,
  ra.context_id,
  ra.group_number::SMALLINT,
  ra.position::SMALLINT,
  ra.years::SMALLINT[],
  ra.is_disabled,
  ra.is_default,
  ra.is_quick_fact,
  ra.tooltip_text
FROM resize_by_quants raq
JOIN resize_by_attributes ra ON ra.id = raq.resize_by_attribute_id
JOIN attributes a ON a.original_id = raq.quant_id AND a.original_type = 'Quant'
