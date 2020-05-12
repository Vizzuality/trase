WITH context_node_types_with_props AS (
  SELECT
    context_id,
    node_type_id,
    column_position,
    node_types.name AS node_type,
    role,
    column_group,
    is_default
  FROM context_node_types
  JOIN context_node_type_properties ON context_node_types.id = context_node_type_properties.context_node_type_id
  JOIN node_types ON context_node_types.node_type_id = node_types.id
  WHERE context_node_type_properties.is_visible
)
SELECT
  contexts.id,
  country_id,
  commodity_id,
  years,
  default_year,
  commodities.name AS commodity_name,
  countries.name AS country_name,
  countries.iso2,
  default_basemap,
  is_disabled,
  is_default,
  is_subnational,
  is_highlighted,
  COALESCE(contexts_with_profiles.id IS NOT NULL, false) AS has_profiles,
  node_types_by_role.node_types_by_role,
  context_node_types_agg.node_types_by_name,
  context_node_types_agg.node_types
FROM contexts
JOIN commodities ON contexts.commodity_id = commodities.id
JOIN countries ON contexts.country_id = countries.id
JOIN context_properties ON context_properties.context_id = contexts.id
JOIN (
  SELECT
    context_id,
    JSONB_OBJECT_AGG(role, node_type_id) AS node_types_by_role
  FROM context_node_types_with_props
  WHERE role is NOT NULL
  GROUP BY context_id
) node_types_by_role ON node_types_by_role.context_id = contexts.id
JOIN (
  SELECT
    context_id,
    JSONB_OBJECT_AGG(node_type, node_type_id) AS node_types_by_name,
    JSONB_AGG(JSONB_BUILD_OBJECT(
      'node_type_id'::text, node_type_id,
      'is_default'::text, is_default,
      'column_group'::text, column_group,
      'role'::text, role,
      'node_type'::text, node_type
    ) ORDER BY column_position) AS node_types
  FROM context_node_types_with_props
  GROUP BY context_id
) context_node_types_agg ON context_node_types_agg.context_id = contexts.id
LEFT JOIN (
  SELECT DISTINCT context_id AS id
  FROM context_node_types
  JOIN profiles ON context_node_types.id = profiles.context_node_type_id
) contexts_with_profiles ON contexts_with_profiles.id = contexts.id;
