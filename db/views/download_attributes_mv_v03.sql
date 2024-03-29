SELECT da.*, a.id AS attribute_id, a.original_type, a.original_id
FROM download_quants daq
JOIN download_attributes da ON da.id = daq.download_attribute_id
JOIN attributes_mv a ON a.original_id = daq.quant_id AND a.original_type = 'Quant'

UNION ALL

SELECT da.*, a.id AS attribute_id, a.original_type, a.original_id
FROM download_quals daq
JOIN download_attributes da ON da.id = daq.download_attribute_id
JOIN attributes_mv a ON a.original_id = daq.qual_id AND a.original_type = 'Qual'