SELECT
  da.id,
  a.id AS attribute_id,
  da.context_id,
  a.original_id,
  da.position::SMALLINT,
  da.years::SMALLINT[],
  a.original_type,
  da.display_name
FROM download_quants daq
JOIN download_attributes da ON da.id = daq.download_attribute_id
JOIN attributes a ON a.original_id = daq.quant_id AND a.original_type = 'Quant'

UNION ALL

SELECT
  da.id,
  a.id AS attribute_id,
  da.context_id,
  a.original_id,
  da.position::SMALLINT,
  da.years::SMALLINT[],
  a.original_type,
  da.display_name
FROM download_quals daq
JOIN download_attributes da ON da.id = daq.download_attribute_id
JOIN attributes a ON a.original_id = daq.qual_id AND a.original_type = 'Qual'
