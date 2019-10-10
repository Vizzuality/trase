SELECT ra.*, a.id AS attribute_id
FROM resize_by_quants raq
JOIN resize_by_attributes ra ON ra.id = raq.resize_by_attribute_id
JOIN attributes a ON a.original_id = raq.quant_id AND a.original_type = 'Quant'
