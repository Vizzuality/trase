SELECT
  commodity_id,
  country_id,
  context_id,
  qual_id,
  ARRAY_AGG(DISTINCT flow_quals.value ORDER BY flow_quals.value) AS distinct_values
FROM flow_quals
JOIN flows ON flow_quals.flow_id = flows.id
JOIN contexts ON flows.context_id = contexts.id
WHERE value NOT LIKE 'UNKNOWN%'
GROUP BY commodity_id, country_id, context_id, qual_id;
