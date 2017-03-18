WITH aggregated_flows AS (
  SELECT
    f.context_id,
    f.node_type,
    f.name AS node,
    f.node_id,
    f.geo_id,
    f_ex.node_id AS exporter_node_id,
    f_ex.name AS exporter_node,
    f_im.node_id AS importer_node_id,
    f_im.name AS importer_node,
    f_ctry.node_id AS country_node_id,
    f_ctry.name AS country_node,
    f.year,
    fi.indicator_type,
    fi.indicator_id,
    fi.name AS indicator,
    fi.name_with_unit AS indicator_with_unit,
    BOOL_AND(fi.boolean_value) AS bool_and,
    SUM(fi.numeric_value) AS sum
  FROM node_flows f
  JOIN node_flows f_ex ON f_ex.node_type = 'EXPORTER'::text AND f.flow_id = f_ex.flow_id
  JOIN node_flows f_im ON f_im.node_type = 'IMPORTER'::text AND f.flow_id = f_im.flow_id
  JOIN node_flows f_ctry ON f_ctry.node_type = 'COUNTRY'::text AND f.flow_id = f_ctry.flow_id
  JOIN flow_indicators fi ON f.flow_id = fi.flow_id
  GROUP BY
    f.context_id,
    f.year,
    f.node_id,
    f.node_type,
    f.name,
    f.geo_id,
    f_ex.node_id,
    f_ex.name,
    f_im.node_id,
    f_im.name,
    f_ctry.node_id,
    f_ctry.name,
    fi.indicator_type,
    fi.indicator_id,
    fi.name,
    fi.name_with_unit
), with_totals AS (
  SELECT
    context_id,
    NULL AS node_type,
    'TOTAL' AS node,
    NULL AS node_id,
    NULL AS geo_id,
    exporter_node_id,
    exporter_node,
    importer_node_id,
    importer_node,
    country_node_id,
    country_node,
    year,
    indicator_type,
    indicator_id,
    indicator_with_unit,
    CASE
      WHEN indicator_type = 'Qual' AND BOOL_AND(bool_and) THEN 'yes'
      WHEN indicator_type = 'Qual' AND NOT BOOL_AND(bool_and) THEN 'no'
      ELSE SUM(sum)::TEXT
    END AS total
  FROM aggregated_flows
  WHERE node_type = 'STATE'
  GROUP BY
    context_id,
    exporter_node_id,
    exporter_node,
    importer_node_id,
    importer_node,
    country_node_id,
    country_node,
    year,
    indicator_type,
    indicator_id,
    indicator_with_unit

  UNION ALL

  SELECT
    context_id,
    node_type,
    node,
    node_id,
    geo_id,
    exporter_node_id,
    exporter_node,
    importer_node_id,
    importer_node,
    country_node_id,
    country_node,
    year,
    indicator_type,
    indicator_id,
    indicator_with_unit,
    CASE
      WHEN indicator_type = 'Qual' AND bool_and THEN 'yes'
      WHEN indicator_type = 'Qual' AND NOT bool_and THEN 'no'
      ELSE sum::TEXT
    END AS total
  FROM aggregated_flows
)
SELECT * FROM with_totals
ORDER BY
  CASE
  WHEN node_type IS NULL THEN 1
  WHEN node_type = 'STATE' THEN 2
  WHEN node_type = 'BIOME' THEN 3
  ELSE 4
END, node, exporter_node, importer_node, country_node, indicator_with_unit;
