SELECT
  f_0.flow_id,
  f_0.context_id,
  f_0.year,
  f_0.name AS name_0,
  f_1.name AS name_1,
  f_2.name AS name_2,
  f_3.name AS name_3,
  f_4.name AS name_4,
  f_5.name AS name_5,
  f_6.name AS name_6,
  f_7.name AS name_7,
  f_0.node_id AS node_id_0,
  f_1.node_id AS node_id_1,
  f_2.node_id AS node_id_2,
  f_3.node_id AS node_id_3,
  f_4.node_id AS node_id_4,
  f_5.node_id AS node_id_5,
  f_6.node_id AS node_id_6,
  f_7.node_id AS node_id_7,
  CASE
    WHEN f_5.node_type = 'EXPORTER' THEN f_5.node_id -- BRAZIL-SOY
    WHEN f_2.node_type = 'EXPORTER' THEN f_2.node_id -- PARAGUAY-SOY, BRAZIL-BEEF
    WHEN f_2.node_type = 'TRADER' THEN f_2.node_id -- ARGENTINE-SOY, ARGENTINA-BEEF, PARAGUAY-BEEF
    WHEN f_1.node_type = 'EXPORTER' THEN f_1.node_id -- INDONESIA-PALM OIL
  END AS exporter_node_id,
  CASE
    WHEN f_6.node_type = 'IMPORTER' THEN f_6.node_id -- BRAZIL-SOY
    WHEN f_3.node_type = 'IMPORTER' THEN f_3.node_id -- BRAZIL-BEEF
    WHEN f_2.node_type = 'IMPORTER' THEN f_2.node_id -- INDONESIA-PALM OIL
    ELSE NULL -- OTHERS
  END AS importer_node_id,
  CASE
    WHEN f_7.node_type = 'COUNTRY' THEN f_7.node_id -- BRAZIL-SOY
    WHEN f_4.node_type = 'COUNTRY' THEN f_4.node_id -- BRAZIL-BEEF
    WHEN f_3.node_type = 'COUNTRY' THEN f_3.node_id -- OTHERS
  END AS country_node_id,
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
FROM node_flows f_0
JOIN node_flows f_1 ON f_1.flow_id = f_0.flow_id AND f_1.column_position = 1
JOIN node_flows f_2 ON f_2.flow_id = f_0.flow_id AND f_2.column_position = 2
JOIN node_flows f_3 ON f_3.flow_id = f_0.flow_id AND f_3.column_position = 3
LEFT JOIN node_flows f_4 ON f_4.flow_id = f_0.flow_id AND f_4.column_position = 4
LEFT JOIN node_flows f_5 ON f_5.flow_id = f_0.flow_id AND f_5.column_position = 5
LEFT JOIN node_flows f_6 ON f_6.flow_id = f_0.flow_id AND f_6.column_position = 6
LEFT JOIN node_flows f_7 ON f_7.flow_id = f_0.flow_id AND f_7.column_position = 7
JOIN flow_indicators fi ON f_0.flow_id = fi.flow_id AND f_0.context_id = fi.context_id
WHERE f_0.column_position = 0
GROUP BY
  f_0.flow_id,
  f_0.context_id,
  f_0.year,
  f_0.name,
  f_0.node_id,
  f_1.name,
  f_1.node_id,
  f_1.node_type,
  f_2.name,
  f_2.node_id,
  f_2.node_type,
  f_3.name,
  f_3.node_id,
  f_3.node_type,
  f_4.name,
  f_4.node_id,
  f_4.node_type,
  f_5.name,
  f_5.node_id,
  f_5.node_type,
  f_6.name,
  f_6.node_id,
  f_6.node_type,
  f_7.name,
  f_7.node_id,
  f_7.node_type,
  fi.indicator_type,
  fi.indicator_id,
  fi.name,
  fi.name_with_unit,
  fi.name_in_download;
