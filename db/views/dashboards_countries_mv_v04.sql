SELECT
  country_id AS id,
  TRIM(countries.name) AS name,
  TO_TSVECTOR('simple', COALESCE(TRIM(countries.name)::TEXT, '')) AS name_tsvector,
  countries.iso2,
  fp.commodity_id,
  fp.node_id,
  fp.profile
FROM dashboards_flow_paths_mv fp
JOIN countries ON countries.id = fp.country_id
GROUP BY (country_id, countries.name, countries.iso2, commodity_id, node_id, profile);
