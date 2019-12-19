SELECT context_id, year, attribute_type, attribute_id, COUNT(*)
FROM download_flows_v
GROUP BY context_id, year, attribute_type, attribute_id;
