---
name: Removing unused indexes
menu: Backend
---

# Removing unused indexes

## Why would you even bother doing this?

When creating ActiveRecord tables using migrations, we take advantage of the `references` method to create foreign keys. By default an index is also created automatically in these cases.

While often a good idea, the assumption being we will be using this column for joining tables, often indexes end up being unused and become a liability. They take up a lot of space needlessly and slow down table writes. Which is why it is good to review indexes.

## How to detect unused indexes?

1. Identify relevant environments from which to get statistics

  - production (environment with most reliable data for API queries)
  - sandbox (environment with most reliable data for data uploader and validation queries)
  - in case of features which had not been release to production yet, the environment where they are actively tested

2. Retrieve lists of potentially unused indexes from all relevant environments

  ```
SELECT s.schemaname,
       s.relname AS tablename,
       s.indexrelname AS indexname,
       pg_relation_size(s.indexrelid) AS index_size
FROM pg_catalog.pg_stat_user_indexes s
   JOIN pg_catalog.pg_index i ON s.indexrelid = i.indexrelid
WHERE s.idx_scan = 0      -- has never been scanned
  AND 0 <>ALL (i.indkey)  -- no index column is an expression
  AND NOT i.indisunique   -- is not a UNIQUE index
  AND NOT EXISTS          -- does not enforce a constraint
         (SELECT 1 FROM pg_catalog.pg_constraint c
          WHERE c.conindid = s.indexrelid)
ORDER BY pg_relation_size(s.indexrelid) DESC;
```

  Note: you can also use the maintenance.unused_indexes view.

3. Prepare files

  Save those lists in files, e.g. `production.txt`, `sandbox.txt`, `staging.txt`. For comparisons, the size of the index should be removed from the file (as this can differ between environments).

4. Find the common ones

  Using a combination of `sort` and `comm` you can get the list of indexes which appear to be unused in all environments:

  ````
comm -12 <(sort production.txt) <(sort sandbox.txt) > tmp.txt
comm -12 <(sort staging.txt) <(sort tmp.txt) > unused_indexes.txt
```

5. Use your judgement

  The statistics can be misleading. Don't automatically remove indexes which you suspect are used very rarely, but when they are they make a massive difference. Evaluate those separately.

  In most cases indexes which have a small size can be removed safely; if the index is small, that means the table is small and the planner will go for a sequential scan over an index anyway.

## How to remove indexes?

Use `remove_index` in one of its 2 forms:

- `remove_index(table_name, column: column_names)` - if you're sure you don't have indexes defined on same columns with different names (e.g. expression indexes or partial indexes)
- `remove_index(table_name, name: index_name)` - otherwise


For example:

```
index = {
  table: 'table name',
  columns: 'column name' OR ['column 1 name', 'column 2 name'],
  name: 'index name'
}
```

```
if index_exists?(index[:table], index[:columns], name: index[:name])
  remove_index index[:table], name: index[:name]
end
```

The `if` is a precaution, in case any of the environments had been modified manually.
