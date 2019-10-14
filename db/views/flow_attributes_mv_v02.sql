SELECT attributes.id AS attribute_id,
       attributes.name,
       attributes.display_name,
       attributes.unit,
       flows.context_id,
       ARRAY_AGG(DISTINCT flows.year) AS years
FROM flows
INNER JOIN flow_quants ON flow_quants.flow_id = flows.id
INNER JOIN attributes ON attributes.original_type = 'Quant' AND
                         attributes.original_id = flow_quants.quant_id
GROUP BY attributes.id,
         attributes.name,
         attributes.display_name,
         attributes.unit,
         flows.context_id

UNION ALL

SELECT attributes.id AS attribute_id,
       attributes.name,
       attributes.display_name,
       attributes.unit,
       flows.context_id,
       ARRAY_AGG(DISTINCT flows.year) AS years
FROM flows
INNER JOIN flow_quals ON flow_quals.flow_id = flows.id
INNER JOIN attributes ON attributes.original_type = 'Qual' AND
                         attributes.original_id = flow_quals.qual_id
GROUP BY attributes.id,
         attributes.name,
         attributes.display_name,
         attributes.unit,
         flows.context_id

UNION ALL

SELECT attributes.id AS attribute_id,
       attributes.name,
       attributes.display_name,
       attributes.unit,
       flows.context_id,
       ARRAY_AGG(DISTINCT flows.year) AS years
FROM flows
INNER JOIN flow_inds ON flow_inds.flow_id = flows.id
INNER JOIN attributes ON attributes.original_type = 'Ind' AND
                         attributes.original_id = flow_inds.ind_id
GROUP BY attributes.id,
         attributes.name,
         attributes.display_name,
         attributes.unit,
         flows.context_id
