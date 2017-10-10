# TRASE API

[![Build Status](https://travis-ci.org/Vizzuality/trase-api.svg?branch=master)](https://travis-ci.org/Vizzuality/trase-api)

API for the new [Trase](http://trase.earth) functionalities

## Requirements

This project uses:
- Ruby 2.4.0
- Rails 5.0
- PostgreSQL 9.x with `intarray` and `tablefunc` extensions

## Deployment

We use Capistrano as a deployment tool. Refer to its documentation for more info

## Test

```
RAILS_ENV=test rake db:drop db:create db:structure:load
bundle exec rspec spec
```

## Database tuning

This is a useful post: [Performance Tuning Queries in PostgreSQL](https://www.geekytidbits.com/performance-tuning-postgres/)

Always use either in production or an equivalent staging environment. No point running in local environment.

### Enabling statistics collection in PostgreSQL
In the target database:

`CREATE EXTENSION pg_stat_statements;`

In postgresql.conf:

`
shared_preload_libraries = 'pg_stat_statements'         # (change requires restart)
pg_stat_statements.max = 10000
pg_stat_statements.track = all
`

Restart postgres server. Wait for usage statistics to be collected, then run this for list of longest running queries:

`SELECT * FROM pg_stat_statements ORDER BY total_time DESC;`

https://www.postgresql.org/docs/current/static/pgstatstatements.html

### Identifying missing indexes

`
SELECT relname, seq_scan-idx_scan AS too_much_seq, CASE WHEN seq_scan-idx_scan>0 THEN 'Missing Index?' ELSE 'OK' END, pg_relation_size(relname::regclass) AS rel_size, seq_scan, idx_scan FROM pg_stat_all_tables WHERE schemaname='public' AND pg_relation_size(relname::regclass)>80000 ORDER BY too_much_seq DESC;
`

### Identifying unused indexes

`
SELECT indexrelid::regclass as index, relid::regclass as table, 'DROP INDEX ' || indexrelid::regclass || ';' as drop_statement FROM pg_stat_user_indexes JOIN pg_index USING (indexrelid) WHERE idx_scan = 0 AND indisunique is false;
`
