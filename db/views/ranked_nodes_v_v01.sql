SELECT
  context_id,
  node_id,
  JSONB_OBJECT_AGG(year, rank) AS rank_by_year
FROM (
  SELECT
  node_id,
  position,
  context_id,
  year,
  RANK() OVER (PARTITION BY position, context_id, year ORDER BY value DESC) AS rank
  FROM (
    -- TODO: use flow_nodes here?
    SELECT
      a.node_id,
      a.position,
      context_id,
      year,
      SUM(value) AS value
    FROM flow_quants,
    flows,
    LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position")
    WHERE flow_quants.flow_id = flows.id
    AND flow_quants.quant_id IN (SELECT id FROM quants WHERE name = 'Volume')
    GROUP BY
      a.node_id,
      a.position,
      flows.context_id,
      flows.year
  ) node_volume_per_context_and_year
) node_volume_per_context_and_year_ranked
GROUP BY context_id, node_id;
