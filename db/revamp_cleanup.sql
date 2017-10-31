DELETE FROM node_quants a
USING (
        SELECT
          MIN(ctid) AS ctid,
          node_id,
          quant_id,
          year
        FROM node_quants
        GROUP BY node_id, quant_id, year
        HAVING COUNT(*) > 1
      ) b
WHERE a.node_id = b.node_id AND a.quant_id = b.quant_id AND a.year = b.year
      AND a.ctid <> b.ctid;
