SELECT commodity_id, country_id, context_id, quant_id, year, SUM(flow_quants.value) AS total
FROM flow_quants
JOIN flows ON flow_quants.flow_id = flows.id
JOIN contexts ON flows.context_id = contexts.id
WHERE flows.year = contexts.default_year
  AND quant_id IN (SELECT id FROM quants WHERE name = 'Volume')
GROUP BY commodity_id, country_id, context_id, quant_id, year;
