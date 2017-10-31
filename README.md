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


## Schema revamp: migration and documentation

In the transition period as work on changing the database schema continues, new tables are living in a separate `revamp` schema (~namespace), whereas the default `public` schema still contains the old tables. This means we can work on both schemas as necessary.

The base version of the database at this point is:

To migrate the database:

1. run `bundle exec rake db:migrate` to create revamped database objects
2. run `bundle exec rake db:revamp:copy` to copy data between old and new structure

Schema documentation is generated directly from the database and requires the following steps:

1. The file `db/schema_comments.yml` contains documentation of schema objects, which is prepared in a way to easily insert it into the database schema itself using `COMMENT IS` syntax. 
That is done using a dedicated rake task:

    `rake db:revamp:doc:sql`

    Note: this rake task also creates a new dump of structure.sql, as comments are part of the schema.
2. Once comments are in place, it is possible to generate html documentation of the entire schema using an external tool. One os such tools is SchemaSpy, which is an open source java library.
    1. install [Java](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
    2. install [Graphviz](http://www.graphviz.org/)
    3. the [SchemaSpy 6.0.0-rc2](http://schemaspy.readthedocs.io/en/latest/index.html) jar file and [PostgreSQL driver](https://jdbc.postgresql.org/download.html) file are already in doc/db
    4. `rake db:revamp:doc:html` (Please note: I added an extra param to SchemaSpy command which is `-renderer :quartz` which helps with running it on macOS Sierra. No idea if it prevents it from running elsewhere.)
    5. output files are in `doc/db/html` 
3. to update the [GH pages site](https://vizzuality.github.io/trase-api/) all the generated files from `doc/db/html` need to land in the top-level of the `gh-pages` branch. This is currently a manual process, easiest to have the repo checked out twice on local drive to be able to copy between branches (not great and not final.)
