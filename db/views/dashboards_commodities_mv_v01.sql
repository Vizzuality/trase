SELECT
  commodity_id AS id,
  commodities.name,
  fp.country_id,
  fp.node_id
FROM dashboards_flow_paths_mv fp
JOIN commodities ON commodities.id = fp.commodity_id
GROUP BY (commodity_id, commodities.name, country_id, node_id);
