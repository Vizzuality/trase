SELECT
  country_id AS id,
  countries.name,
  countries.iso2,
  flow_id
FROM dashboards_flow_paths_mv fp
JOIN countries ON countries.id = fp.country_id
GROUP BY (country_id, countries.name, countries.iso2, flow_id);