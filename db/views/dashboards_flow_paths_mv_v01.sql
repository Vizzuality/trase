SELECT DISTINCT
  flow_paths.context_id,
  contexts.country_id,
  contexts.commodity_id,
  flow_paths.node_id,
  flow_paths.flow_id
FROM (
  SELECT
    flows.context_id,
    flows.id AS flow_id,
    a.node_id,
    a."position"
  FROM flows, LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position")
) flow_paths
JOIN contexts ON flow_paths.context_id = contexts.id
JOIN nodes ON flow_paths.node_id = nodes.id
JOIN node_types ON nodes.node_type_id = node_types.id
JOIN context_node_types cnt ON node_types.id = cnt.node_type_id AND flow_paths.context_id = cnt.context_id
JOIN context_node_type_properties cnt_props ON cnt.id = cnt_props.context_node_type_id
WHERE cnt_props.column_group = 0 OR node_types.name IN ('COUNTRY', 'IMPORTER', 'EXPORTER', 'TRADER');
