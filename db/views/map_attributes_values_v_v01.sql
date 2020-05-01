WITH node_attributes AS (
  SELECT attributes.id AS attribute_id, node_id, year, value
  FROM node_quants
  JOIN attributes ON attributes.original_id = node_quants.quant_id AND attributes.original_type = 'Quant'
  
  UNION ALL
  
  SELECT attributes.id AS attribute_id, node_id, year, value
  FROM node_inds
  JOIN attributes ON attributes.original_id = node_inds.ind_id AND attributes.original_type = 'Ind'
)
SELECT DISTINCT attribute_id, node_id, year, node_type_id::SMALLINT, value, geo_id, iso2
FROM node_attributes
JOIN nodes_with_flows_or_geo_v nodes ON nodes.id = node_attributes.node_id
JOIN contexts ON contexts.id = nodes.context_id
JOIN countries ON countries.id = contexts.country_id;
