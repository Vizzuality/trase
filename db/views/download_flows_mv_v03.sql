SELECT
  ARRAY[
    f_0.context_id,
    f_0.year,
    f_0.node_id,
    f_1.node_id,
    f_2.node_id,
    f_3.node_id,
    f_4.node_id,
    f_5.node_id,
    f_6.node_id,
    f_7.node_id,
    f_0.flow_id
  ] AS row_name,
  f_0.flow_id AS id,
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
    WHEN f_5.node_type_name = 'EXPORTER' THEN f_5.node_id -- BRAZIL-SOY
    WHEN f_2.node_type_name = 'EXPORTER' THEN f_2.node_id -- PARAGUAY-SOY, BRAZIL-BEEF
    WHEN f_2.node_type_name = 'TRADER' THEN f_2.node_id -- ARGENTINE-SOY, ARGENTINA-BEEF, PARAGUAY-BEEF
    WHEN f_1.node_type_name = 'EXPORTER' THEN f_1.node_id -- INDONESIA-PALM OIL
  END AS exporter_node_id,
  CASE
    WHEN f_6.node_type_name = 'IMPORTER' THEN f_6.node_id -- BRAZIL-SOY
    WHEN f_3.node_type_name = 'IMPORTER' THEN f_3.node_id -- BRAZIL-BEEF
    WHEN f_2.node_type_name = 'IMPORTER' THEN f_2.node_id -- INDONESIA-PALM OIL
    ELSE NULL -- OTHERS
  END AS importer_node_id,
  CASE
    WHEN f_7.node_type_name = 'COUNTRY' THEN f_7.node_id -- BRAZIL-SOY
    WHEN f_4.node_type_name = 'COUNTRY' THEN f_4.node_id -- BRAZIL-BEEF
    WHEN f_3.node_type_name = 'COUNTRY' THEN f_3.node_id -- OTHERS
  END AS country_node_id,
  fi.attribute_type,
  fi.attribute_id,
  fi.name AS attribute_name,
  fi.name_with_unit AS attribute_name_with_unit,
  fi.display_name,
  BOOL_AND(fi.boolean_value) AS bool_and,
  SUM(fi.numeric_value) AS sum,
  CASE
    WHEN fi.attribute_type = 'Qual' AND BOOL_AND(fi.boolean_value) THEN 'yes'
    WHEN fi.attribute_type = 'Qual' AND NOT BOOL_AND(fi.boolean_value) THEN 'no'
    ELSE SUM(fi.numeric_value)::TEXT
  END AS total
FROM flow_paths_mv f_0
JOIN flow_paths_mv f_1 ON f_1.flow_id = f_0.flow_id AND f_1.column_position = 1
JOIN flow_paths_mv f_2 ON f_2.flow_id = f_0.flow_id AND f_2.column_position = 2
JOIN flow_paths_mv f_3 ON f_3.flow_id = f_0.flow_id AND f_3.column_position = 3
LEFT JOIN flow_paths_mv f_4 ON f_4.flow_id = f_0.flow_id AND f_4.column_position = 4
LEFT JOIN flow_paths_mv f_5 ON f_5.flow_id = f_0.flow_id AND f_5.column_position = 5
LEFT JOIN flow_paths_mv f_6 ON f_6.flow_id = f_0.flow_id AND f_6.column_position = 6
LEFT JOIN flow_paths_mv f_7 ON f_7.flow_id = f_0.flow_id AND f_7.column_position = 7
JOIN (
  SELECT
    f.flow_id, f.qual_id AS attribute_id, 'Qual' AS attribute_type,
    null AS numeric_value,
    CASE
      WHEN LOWER(value) = 'yes' THEN true
      WHEN LOWER(value) = 'no' THEN false
      ELSE null
    END AS boolean_value,
    q.name,
    null AS unit,
    q.name AS name_with_unit,
    da.display_name,
    da.context_id
  FROM flow_quals f
  JOIN quals q ON f.qual_id = q.id
  JOIN download_quals dq ON dq.qual_id = q.id
  JOIN download_attributes da ON dq.download_attribute_id = da.id
  GROUP BY f.flow_id, f.qual_id, f.value, q.name, da.display_name, da.context_id

  UNION ALL

  SELECT
    f.flow_id, f.quant_id, 'Quant',
    f.value,
    null,
    q.name,
    q.unit,
    CASE
      WHEN unit IS null THEN q.name
      ELSE q.name || ' (' || q.unit || ')'
    END,
    da.display_name,
    da.context_id
  FROM flow_quants f
  JOIN quants q ON f.quant_id = q.id
  JOIN download_quants dq ON dq.quant_id = q.id
  JOIN download_attributes da ON dq.download_attribute_id = da.id
  GROUP BY f.flow_id, f.quant_id, f.value, q.name, q.unit, da.display_name, da.context_id
) fi ON f_0.flow_id = fi.flow_id AND f_0.context_id = fi.context_id
WHERE f_0.column_position = 0
GROUP BY
  f_0.flow_id,
  f_0.context_id,
  f_0.year,
  f_0.name,
  f_0.node_id,
  f_1.name,
  f_1.node_id,
  f_1.node_type_name,
  f_2.name,
  f_2.node_id,
  f_2.node_type_name,
  f_3.name,
  f_3.node_id,
  f_3.node_type_name,
  f_4.name,
  f_4.node_id,
  f_4.node_type_name,
  f_5.name,
  f_5.node_id,
  f_5.node_type_name,
  f_6.name,
  f_6.node_id,
  f_6.node_type_name,
  f_7.name,
  f_7.node_id,
  f_7.node_type_name,
  fi.attribute_type,
  fi.attribute_id,
  fi.name,
  fi.name_with_unit,
  fi.display_name;
