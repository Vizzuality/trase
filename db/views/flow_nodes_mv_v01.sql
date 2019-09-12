SELECT
  flows.context_id,
  flows.id AS flow_id,
  flows.year,
  a."position",
  a.node_id
FROM public.flows,
  LATERAL unnest(flows.path) WITH ORDINALITY a(node_id, "position");
