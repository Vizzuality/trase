WITH top_destinations_totals AS (
  SELECT flows.context_id, flows.year, flow_quants.quant_id, context_node_types.node_type_id, SUM(value) AS value
  FROM flows
  INNER JOIN context_node_types ON context_node_types.context_id = flows.context_id
  INNER JOIN flow_quants ON flows.id = flow_quants.flow_id
  INNER JOIN nodes ON nodes.id = flows.path[context_node_types.column_position + 1]
  INNER JOIN node_properties ON nodes.id = node_properties.node_id
  WHERE (NOT nodes.is_unknown) AND (NOT node_properties.is_domestic_consumption)
  GROUP BY flows.context_id, flows.year, flow_quants.quant_id, context_node_types.node_type_id
)
SELECT  flows.context_id,
        flows.year,
        flow_quants.quant_id,
        context_node_types.node_type_id,
        flows.path[context_node_types.column_position + 1] AS node_id,
        nodes.name AS name,
        nodes.geo_id,
        SUM(flow_quants.value)::DOUBLE PRECISION AS value,
        (SUM(flow_quants.value)::DOUBLE PRECISION /
         NULLIF((SELECT value
                 FROM top_destinations_totals
                 WHERE context_id = flows.context_id AND
                       year = flows.year AND
                       quant_id = flow_quants.quant_id AND
                       node_type_id = context_node_types.node_type_id), 0)) AS height
FROM flows
INNER JOIN context_node_types ON context_node_types.context_id = flows.context_id
INNER JOIN flow_quants ON flows.id = flow_quants.flow_id
INNER JOIN nodes ON nodes.id = flows.path[context_node_types.column_position + 1]
INNER JOIN node_properties ON nodes.id = node_properties.node_id
WHERE (NOT nodes.is_unknown) AND (NOT node_properties.is_domestic_consumption)
GROUP BY flows.context_id, flows.year, flow_quants.quant_id, context_node_types.node_type_id, flows.path[context_node_types.column_position + 1], nodes.name, nodes.geo_id
