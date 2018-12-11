SELECT
  country_id AS id,
  countries.name,
  to_tsvector('simple', coalesce(countries.name::text, '')) AS name_tsvector,
  countries.iso2,
  fp.commodity_id,
  fp.node_id
FROM dashboards_flow_paths_mv fp
JOIN countries ON countries.id = fp.country_id
GROUP BY (country_id, countries.name, countries.iso2, commodity_id, node_id);
