WITH nodes AS (
  SELECT
    nodes.id,
    nodes.node_type_id,
    nodes.geo_id,
    countries.iso2
  FROM nodes
  JOIN countries ON UPPER(countries.iso2) = UPPER(SUBSTRING(geo_id FROM 1 FOR 2))
  WHERE NOT nodes.is_unknown
  AND geo_id IS NOT NULL
  AND SPLIT_PART(geo_id, '-', 2) <> 'TRADER'

  UNION

  SELECT DISTINCT
    nodes.id,
    nodes.node_type_id,
    nodes.geo_id,
    countries.iso2
  FROM nodes
  JOIN (
    SELECT DISTINCT node_id, context_id FROM flow_nodes
  ) fn ON fn.node_id = nodes.id
  JOIN contexts ON fn.context_id = contexts.id
  JOIN countries ON countries.id = contexts.country_id
  WHERE NOT nodes.is_unknown
  AND geo_id IS NOT NULL
  AND SPLIT_PART(geo_id, '-', 2) <> 'TRADER'
), node_attributes AS (
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
JOIN nodes ON nodes.id = node_attributes.node_id;
