SELECT
  commodity_id AS id,
  TRIM(commodities.name) AS name,
  TO_TSVECTOR('simple', COALESCE(TRIM(commodities.name)::TEXT, '')) AS name_tsvector,
  fp.country_id,
  fp.node_id,
  fp.profile
FROM dashboards_flow_paths_mv fp
JOIN commodities ON commodities.id = fp.commodity_id
GROUP BY (commodity_id, commodities.name, country_id, node_id, profile);
