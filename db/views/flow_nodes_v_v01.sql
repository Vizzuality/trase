SELECT
  flows.id AS flow_id,
  a.node_id,
  flows.context_id,
  a."position",
  flows.year
FROM public.flows,
  LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position");
