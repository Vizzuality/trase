WITH flow_paths AS (
  SELECT DISTINCT(UNNEST(path)) AS node_id, context_id FROM flows
), nodes AS (
  SELECT
    nodes.id,
  nodes.node_type_id,
  fp.context_id
  FROM flow_paths fp
  JOIN nodes ON fp.node_id = nodes.id
), node_values AS (
  SELECT
    ind_id,
    context_id,
    country_id,
    commodity_id,
  ARRAY_AGG(DISTINCT node_type_id ORDER BY node_type_id) AS node_types_ids,
    ARRAY_AGG(DISTINCT year ORDER BY year) AS years
  FROM
    node_inds
  JOIN nodes ON node_inds.node_id = nodes.id
  JOIN contexts ON nodes.context_id = contexts.id
  GROUP BY ind_id,
    GROUPING SETS (
      (context_id),
      (country_id),
      (commodity_id)
    )
), node_values_by_context AS (
  SELECT
    ind_id,
  JSONB_OBJECT_AGG(
    context_id, JSONB_BUILD_OBJECT('years', years, 'node_types_ids', node_types_ids)
  ) AS node_values
  FROM node_values
  WHERE commodity_id IS NULL AND country_id IS NULL AND context_id IS NOT NULL
  GROUP BY ind_id
), node_values_by_country AS (
  SELECT
  ind_id,
  JSONB_OBJECT_AGG(
    country_id, JSONB_BUILD_OBJECT('years', years, 'node_types_ids', node_types_ids)
  ) AS node_values
  FROM node_values
  WHERE commodity_id IS NULL AND country_id IS NOT NULL AND context_id IS NULL
  GROUP BY ind_id
), node_values_by_commodity AS (
  SELECT
  ind_id,
  JSONB_OBJECT_AGG(
    commodity_id, JSONB_BUILD_OBJECT('years', years, 'node_types_ids', node_types_ids)
  ) AS node_values
  FROM node_values
  WHERE commodity_id IS NOT NULL AND country_id IS NULL AND context_id IS NULL
  GROUP BY ind_id
), flow_values AS (
  SELECT
    ind_id,
    context_id,
    country_id,
    commodity_id,
    ARRAY_AGG(DISTINCT year ORDER BY year) AS years
  FROM
    flow_inds
  JOIN flows ON flow_inds.flow_id = flows.id
  JOIN contexts ON flows.context_id = contexts.id
  GROUP BY ind_id,
    GROUPING SETS (
      (context_id),
      (country_id),
      (commodity_id)
    )
), flow_values_by_context AS (
  SELECT
    ind_id,
    JSONB_OBJECT_AGG(
      context_id,
      JSONB_BUILD_OBJECT('years', years)
    ) AS flow_values
  FROM flow_values
  WHERE commodity_id IS NULL AND country_id IS NULL AND context_id IS NOT NULL
  GROUP BY ind_id
), flow_values_by_country AS (
  SELECT
  ind_id,
  JSONB_OBJECT_AGG(
    country_id,
    JSONB_BUILD_OBJECT('years', years)
  ) AS flow_values
  FROM flow_values
  WHERE commodity_id IS NULL AND country_id IS NOT NULL AND context_id IS NULL
  GROUP BY ind_id
), flow_values_by_commodity AS (
  SELECT
  ind_id,
  JSONB_OBJECT_AGG(
    commodity_id,
    JSONB_BUILD_OBJECT('years', years)
  ) AS flow_values
  FROM flow_values
  WHERE commodity_id IS NOT NULL AND country_id IS NULL AND context_id IS NULL
  GROUP BY ind_id
)
SELECT
  inds.id AS ind_id,
  JSONB_BUILD_OBJECT(
    'context', nv1.node_values,
    'country', nv2.node_values,
    'commodity', nv3.node_values
  ) AS node_values,
  JSONB_BUILD_OBJECT(
    'context', fv1.flow_values,
    'country', fv2.flow_values,
    'commodity', fv3.flow_values
  ) AS flow_values
FROM inds
LEFT JOIN node_values_by_context nv1 ON nv1.ind_id = inds.id
LEFT JOIN node_values_by_country nv2 ON nv2.ind_id = inds.id
LEFT JOIN node_values_by_commodity nv3 ON nv3.ind_id = inds.id
LEFT JOIN flow_values_by_context fv1 ON fv1.ind_id = inds.id
LEFT JOIN flow_values_by_country fv2 ON fv2.ind_id = inds.id
LEFT JOIN flow_values_by_commodity fv3 ON fv3.ind_id = inds.id;
