SELECT
  a.attrelid::regclass::text AS table_name,
  a.attname AS column_name,
  v.oid::regclass::text AS dependent_name,
  v.relkind AS dependent_type
FROM pg_attribute AS a   -- columns for the table
   JOIN pg_depend AS d   -- objects that depend on the column
      ON d.refobjsubid = a.attnum AND d.refobjid = a.attrelid
   JOIN pg_rewrite AS r  -- rules depending on the column
      ON r.oid = d.objid
   JOIN pg_class AS v    -- views for the rules
      ON v.oid = r.ev_class
WHERE
  -- dependency must be a rule depending on a relation
  d.classid = 'pg_rewrite'::regclass
  AND d.refclassid = 'pg_class'::regclass
  AND d.deptype = 'n';   -- normal dependency
