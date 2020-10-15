SELECT
flows.context_id,
flow_quants.quant_id,
context_node_types.node_type_id,
nodes.id AS node_id,
flows.year,
nodes.geo_id,
nodes.name,
SUM(flow_quants.value)::DOUBLE PRECISION AS value,
SUM(flow_quants.value)::DOUBLE PRECISION /
NULLIF(
  (
    SUM( -- window function
      SUM(flow_quants.value) -- aggregate function
    ) OVER (
      PARTITION BY flows.context_id, quant_id, context_node_types.node_type_id, year
    )
  )::DOUBLE PRECISION,
  0
) AS height
FROM flow_quants
JOIN flows ON flow_quants.flow_id = flows.id
JOIN context_node_types ON context_node_types.context_id = flows.context_id
JOIN nodes ON nodes.id = flows.path[context_node_types.column_position + 1]
JOIN node_properties ON nodes.id = node_properties.node_id
WHERE (NOT nodes.is_unknown) AND (NOT node_properties.is_domestic_consumption)
GROUP BY
flows.context_id,
flow_quants.quant_id,
context_node_types.node_type_id,
nodes.id,
flows.year;
