SELECT
  f.context_id,
  f.column_group,
  f.column_position,
  CASE WHEN f.node_type = 'COUNTRY OF PRODUCTION' THEN f.name ELSE NULL END AS country_of_production,
  CASE WHEN f.node_type = 'PORT' THEN f.name ELSE NULL END AS port,
  CASE WHEN f.node_type = 'DEPARTMENT' THEN f.name ELSE NULL END AS department,
  CASE WHEN f.node_type = 'MUNICIPALITY' THEN f.name ELSE NULL END AS municipality,
  node_state.value AS state,
  node_biome.value AS biome,
  f.node_id,
  f.geo_id,
  f_ex.node_id AS exporter_node_id,
  f_ex.name AS exporter_node,
  f_ex_port.node_id AS exporter_port_node_id,
  f_ex_port.name AS exporter_port_node,
  f_im.node_id AS importer_node_id,
  f_im.name AS importer_node,
  f_ctry.node_id AS country_node_id,
  f_ctry.name AS country_node,
  f.year,
  fi.indicator_type,
  fi.indicator_id,
  fi.name AS indicator,
  fi.name_with_unit AS indicator_with_unit,
  fi.name_in_download,
  BOOL_AND(fi.boolean_value) AS bool_and,
  SUM(fi.numeric_value) AS sum,
  CASE
    WHEN fi.indicator_type = 'Qual' AND BOOL_AND(fi.boolean_value) THEN 'yes'
    WHEN fi.indicator_type = 'Qual' AND NOT BOOL_AND(fi.boolean_value) THEN 'no'
    ELSE SUM(fi.numeric_value)::TEXT
  END AS total
FROM node_flows f
LEFT JOIN node_flows f_ex ON f_ex.column_group = 1 AND f_ex.node_type = 'EXPORTER' AND f.flow_id = f_ex.flow_id
LEFT JOIN node_flows f_ex_port ON f_ex_port.column_group = 1 AND f_ex_port.node_type = 'PORT' AND f.flow_id = f_ex_port.flow_id
JOIN node_flows f_im ON f_im.column_group = 2 AND f.flow_id = f_im.flow_id
JOIN node_flows f_ctry ON f_ctry.column_group = 3 AND f.flow_id = f_ctry.flow_id
JOIN flow_indicators fi ON f.flow_id = fi.flow_id AND f.context_id = fi.context_id
LEFT JOIN node_quals node_state ON node_state.node_id = f.node_id AND node_state.qual_id IN (SELECT qual_id FROM quals WHERE name = 'STATE')
LEFT JOIN node_quals node_biome ON node_biome.node_id = f.node_id AND node_biome.qual_id IN (SELECT qual_id FROM quals WHERE name = 'BIOME')
WHERE f.column_group = 0 AND f.is_default
GROUP BY
  f.context_id,
  f.year,
  f.node_type,
  f.node_id,
  f.column_group,
  f.column_position,
  f.name,
  node_state.value,
  node_biome.value,
  f.geo_id,
  f_ex.node_id,
  f_ex.name,
  f_ex_port.node_id,
  f_ex_port.name,
  f_im.node_id,
  f_im.name,
  f_ctry.node_id,
  f_ctry.name,
  fi.indicator_type,
  fi.indicator_id,
  fi.name,
  fi.name_with_unit,
  fi.name_in_download;
