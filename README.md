# TRASE

[![Build Status](https://travis-ci.org/Vizzuality/trase.svg?branch=master)](https://travis-ci.org/Vizzuality/trase)

[![Maintainability](https://api.codeclimate.com/v1/badges/93fec294b49106c35c18/maintainability)](https://codeclimate.com/github/Vizzuality/trase/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/93fec294b49106c35c18/test_coverage)](https://codeclimate.com/github/Vizzuality/trase/test_coverage)

Source code for [Trase](http://trase.earth)

![TRASE](trase-screenshot.png)

## About TRASE

Trase brings unprecedented transparency to commodity supply chains revealing new pathways towards achieving a
deforestation-free economy.

## Project structure

This repository contains two technically independent applications:
- `/frontend` contains the frontend application, including a dedicated nodejs server (for dev purposes only)
- `/` contains the Rails 5.x API that serves data to the above mentioned frontend application

While technically independent, the frontend application is heavily dependent on the API spec served by the rails application.

## Requirements

This project uses:
- Ruby 2.4.2
- Rails 5.1+
- Nodejs 8.2+
- PostgreSQL 9.5+ with `intarray`, `tablefunc` and `postgres_fdw` extensions
- [Bundler](http://bundler.io/)
- redis >= 3

## Setup

For the API:
- Make sure you have Ruby and Bundler installed
- Use Bundler's `bundle install` to install all ruby dependencies
- Copy `.env.sample` to `.env` and replace the values accordingly. See the API documentation below for more information.
- To setup the development database, first create a database in PostgreSQL and then import a base dump into it
- Next, run `rake db:migrate` and `rake content:db:migrate` to update its structure

You can now use `rails server` to start the API application

For the frontend application:
- `cd` into the `frontend` folder
- Copy `.env.sample` to `.env` and replace the values accordingly. See the frontend application documentation below for more information.
- Install dependencies using `npm install`

You can start the development server with `npm start`

You can start background job processing with:
- `redis-server`
- `bundle exec sidekiq`

## Deployment

We use [Capistrano](http://capistranorb.com/) as a deployment tool, which deploys both API and frontend application simultaneously.
To deploy, simply use:

```
cap <staging|production> deploy
```

We use Varnish in staging / production for caching. The following configuration needs to be present to enable cache purging in `/etc/varnish/default.vcl`:

```
acl purge {
    "localhost";
}

sub vcl_recv {
    # Happens before we check if we have this in cache already.
    #
    # Typically you clean up the request here, removing cookies you don't need,
    # rewriting the request, etc.

    # allow PURGE from localhost
    if (req.method == "PURGE") {
        if (!client.ip ~ purge) {
            return(synth(403, "Not allowed."));
        }
        return (purge);
    }

    if (req.method == "BAN") {
        # Same ACL check as above:
        if (!client.ip ~ purge) {
            return(synth(403, "Not allowed."));
        }
        ban("obj.http.x-url ~ " + req.http.X-Ban-Url);
        return (synth(200, "Ban added"));
    }
}

sub vcl_backend_response {
    # Happens after we have read the response headers from the backend.
    #
    # Here you clean the response headers, removing silly Set-Cookie headers
    # and other mistakes your backend does.
    set beresp.http.x-url = bereq.url;
}

sub vcl_deliver {
    # Happens when we have all the pieces we need, and are about to send the
    # response to the client.
    #
    # You can do accounting or modifying the final object here.
    unset resp.http.x-url;
}
```


## Git hooks

This project includes a set of git hooks that you may find useful
- Run `bundle install` when loading `Gemfile.lock` modifications from remotes
- Run `npm install` when loading `frontend/package.json` modifications from remotes
- Receive a warning when loading `.env.sample` or `frontend/.env.sample` modifications from remotes
- Run `Rubocop` and `JS Lint` before committing

To enable then, simply execute once: `bin/git/init-hooks`


# API

## Configuration

The project's main configuration values can be set using [environment variables](https://en.wikipedia.org/wiki/Environment_variable) in the `.env` file.

* SECRET_KEY_BASE: Rails secret key. Use a random value
* POSTGRES_HOSTNAME: Hostname of your database server
* POSTGRES_DATABASE: Name of your data database
* POSTGRES_CONTENT_DATABASE: Name of your content database
* POSTGRES_USERNAME: Username used to connect to your PostgreSQL server instance
* POSTGRES_PASSWORD: Password used to connect to your PostgreSQL server instance
* POSTGRES_PORT: Port used to connect to your PostgreSQL server instance
* MAILCHIMP_API_KEY: API key for Mailchimp mailing service
* MAILCHIMP_LIST_ID: List ID for Mailchimp mailing service
* APPSIGNAL_PUSH_API_KEY: Appsignal API key for tracking exceptions
* GOLD_MASTER_HOST_V1:
* GOLD_MASTER_HOST_V2:
* GOLD_MASTER_HOST_V3:
* TRASE_REMOTE_HOST=localhost
* TRASE_REMOTE_PORT=5432
* TRASE_REMOTE_DATABASE=trase
* TRASE_REMOTE_SCHEMA=trase # this schema in remote database
* TRASE_REMOTE_USER=main_ro # this user defined in remote database with read-only access to trase schema
* TRASE_REMOTE_PASSWORD=
* TRASE_REMOTE_SERVER=trase_server
* TRASE_LOCAL_FDW_SCHEMA=main # this schema in local database where remote tables are mapped
* TRASE_LOCAL_SCHEMA=public # this schema in local database where target tables are

## Background jobs

We use sidekiq to process long running jobs in the background.

Currently we're using it for 2 types of database jobs:
- updating `download_flows_mv`, which takes around 2 minutes and is triggered by updates to a number of "yellow" tables, e.g. downlaod_attributes
- importing new data from main database, which takes around two hours and is triggered either by clicking a button in the admin tool or running a rake task

In both cases the times might grow as the dataset grows, which is important to keep in mind because the current configuration might need tuning when that happens.

Our use case of sidekiq does not benefit from high concurrency, because both workers need to run one at a time. Therefore, concurrency settings in `config/sidekiq.yml` and `config/initializers/sidekiq.rb` are low to match that and avoid using up resources unnecessarily. Again, if we at any point later add more background jobs with different concurrency characteristics, this may need to be revised.

To ensure only one database job can run at any single time we use `sidekiq-unique-jobs` gem. It works at 2 stages:
- when adding a job to the queue,
- when pulling the job from the queue to start execution.

It can be configured to lock execution according to a number of predefined strategies and the one we use is called `:until_and_while_executing`. It works as follows: you can enqueue a duplicate job A' unless job A is already enqueued; A' will not start executing until A is finished, at which point it will be possible to enqueue another job A''. It is also important to understand that the unique locks have an expiration time, which I set to match average execution time. It seems that without this in place it is possible that an enqueued job will start executing too early (after a default timeout of 60 seconds).

In practice this means that if the admin makes 3 updates in a short time frame ( < lock expiration time) to e.g. Download Attributes, normally the `DownloadFlowsRefreshWorker` would be enqueued and executed 3 times, possibly concurrently. With the unique lock in place, it will enqueue the first one and if possible start executing immediately, possibly allowing to enqueue the second one while first one is in progress; the third one will never be enqueued. Once the first one has completed the second one will be executed.

## Test

```
RAILS_ENV=test rake db:drop db:create db:structure:load
bundle exec rspec spec
```

## Gold master tests

There are 2 rake tasks:

- `bundle exec rake gold_master:record` - this one should be re-run when `spec/support/gold_master_urls.yml` is updated. It records the gold master responses for all the urls and zips them in `spec/support/gold_master.zip`. It should be run using the pre-revamp version of the backend code and database:
    * https://github.com/sei-international/TRASE/releases/tag/pre-revamp
    * https://github.com/Vizzuality/trase-api/releases/tag/pre-revamp
    * Note: some responses are huge, over 1 MB. They're zipped and stored using GLFS.
- `bundle exec rake gold_master:test` - this one collects responses as generated by the current version of the code and compares with the gold master using json & csv diffing tools. It's intended to be used with the same version of the database as the gold master.
  * Note: the responses are stored uncompressed in `tmp/actual` and are not cleaned after the tests have run.

Both tasks are parametrised by same env variables to specify the hosts on which to run, when running in local environment this is going to be something like:

```
GOLD_MASTER_HOST_V1=http://localhost:8080
GOLD_MASTER_HOST_V2=http://localhost:3000
GOLD_MASTER_HOST_V3=http://localhost:3000
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

### Database documentation

Schema documentation is generated directly from the database and requires the following steps:

1. The file `db/schema_comments.yml` contains documentation of schema objects, which is prepared in a way to easily insert it into the database schema itself using `COMMENT IS` syntax.
That is done using a dedicated rake task:

    `rake db:doc:sql`

    Note: this rake task also creates a new dump of structure.sql, as comments are part of the schema.
2. Once comments are in place, it is possible to generate html documentation of the database schema using an external tool. One os such tools is SchemaSpy, which is an open source java library.
    1. install [Java](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
    2. install [Graphviz](http://www.graphviz.org/)
    3. the [SchemaSpy 6.0.0-rc2](http://schemaspy.readthedocs.io/en/latest/index.html) jar file and [PostgreSQL driver](https://jdbc.postgresql.org/download.html) file are already in doc/db
    4. `rake db:doc:html`
    5. output files are in `doc/db/all_tables` (complete schema) and `doc/db/blue_tables` (only blue tables)
3. to update the [GH pages site](https://vizzuality.github.io/trase-api/) all the generated files from `doc/db/all_tables` and `doc/db/blue_tables` need to land in the top-level of the `gh-pages` branch. This is currently a manual process, easiest to have the repo checked out twice on local drive to be able to copy between branches (not great and not final.)

## Data import process

The new data import process was put in place to make it easy to update the Trase database directly from the Main database. The differences between the two databases are as follows:
- the Main database contains the core data regarding flows, nodes and attributes. It contains more data than what is show on Trase.
- the Trase database contains a subset of the Main database as well as additional tables which describe how to visualise that data.

There is overlap between the two databases, which is the core data to be displayed in Trase. These are the tables which hold that data:
- `countries`
- `commodities`
- `contexts`
- `node_types`
- `context_node_types`
- `download_versions`
- `inds`
- `quals`
- `quants`
- `nodes`
- `node_inds`
- `node_quals`
- `node_quants`
- `flows`
- `flow_inds`
- `flow_quals`
- `flow_quants`

They are referred to as "blue tables". The remaining tables in the Trase database, which are linked to the blue tables and describe how to visualise data, are referred to as "yellow tables". For example, the blue table `inds` holds basic information about an attribute called `SOY_YIELD` and the yellow table `ind_properties` holds the information about what tooltip to display with that attribute.

The objective of the import process is to copy the blue tables verbatim from Main to Trase overwriting previous content, but to preserve any yellow tables information which remains relevant.

### Connection between the two databases

We assume that it is possible to establish a connection between the Trase and Main databases using a postgres extension `postgres_fdw`. A number of connection properties need to be specified in order for the connection to be established, they need to be defined as environment variables:

```
TRASE_REMOTE_HOST=localhost
TRASE_REMOTE_PORT=5432
TRASE_REMOTE_DATABASE=trase_core
TRASE_REMOTE_SCHEMA=trase # this schema in remote database
TRASE_REMOTE_USER=main_ro # this user defined in remote database with read-only access to trase schema
TRASE_REMOTE_PASSWORD=
TRASE_REMOTE_SERVER=trase_server
```

We assume that there is a separate schema which contains data ready to be imported into Trase, the name is configured as `TRASE_REMOTE_SCHEMA`, e.g. `trase`. We also assume there is a user with read-only privileges for that schema, e.g. `main_ro`.

`GRANT SELECT ON ALL TABLES IN SCHEMA trase TO main_ro`

### Foreign table wrappers

The extension `postgres_fdw` allows us to access tables in the Main database directly within the Trase database. It requires that a number of objects are created in the database:
- the server (name configured as `TRASE_REMOTE_SERVER`, e.g. `trase_server`)
- user mappings which allow a user of the Trase database to connect to the Main database as the read-only user
- definitions of foreign tables

All of these can be created using the following rake task:
`bundle exec rake db:remote:init`

In case anything changes (e.g. table definitions), this can be re-initialized using:
`bundle exec rake db:remote:reinit`

Foreign tables will be created in a schema configured as `TRASE_LOCAL_FDW_SCHEMA`.

*Note to future self: Because the server and user mappings definitions may contain sensitive information, I needed a way to remove them from the SQL dump. I wasn't able to find a clean way to do it, so there is a monkey-patched version of `PostgreSQLDatabaseTasks.structure_dump` which removes those definitions from the dump. The idea is that after restoring from the dump, the `init` task needs to be run to establish the required objects for the import script.*

### Import script

The importer script code is contained in `lib/api/v3/import/importer.rb`. The script goes over tables in a specific order, whereby each table is preceded by all the tables it depends on. *Note to future self*: for this to continue working as the database grows, cycles in the schema need to be avoided.

Tables are processed differently depending on whether they are "blue" or "yellow". It can be easily recognised which is which based on the subclass of the model: either `Api::V3::BlueTable` or `Api::V3::YellowTable`.

In the first step all the tables are backed up, which means different things in case of blue and yellow tables.

For the blue tables we store a mapping between the old `id` (from local table) and new `id` (from remote table). This is a temporary table with just two columns: `id` and `new_id`. *Note to future self: the assumption here is that each of the blue tables has a unique numeric identifier called `id` in both the local and remote table. We assume those identifiers are not stable across data updates, which is why we create a mapping in this step.* In order to match the local table to the remote table we use columns specified in `import_key`, which is a method that needs to be defined for each blue table. For example, the import key for the `countries` table contains only the `iso2` column (which has a unique constraint set) and so local and remote can be matched on this column. Sometimes the import key contains foreign keys, for example `contexts` has an `import_key` consisting of `country_id` and `commodity_id`; of course those are unstable foreign keys, so they cannot be used to match rows directly in the remote table; instead, we need to match using the id mapping of both `countries` and `commodities` tables. The script knows to do that based on the list of unstable foreign keys which are called `blue_foreign_keys` and detects if the `import_key` overlaps with `blue_foreign_keys`, requiring a lookup in the mapping. That mapping needs to be available at the time, which is why order of processing blue tables matters.

For the yellow tables, we simply back up the entire table in a temporary table.

Once all tables are backed up, the import can commence. The import process iterates over blue tables and their respective dependant yellow tables. Consider this chain of dependencies, which shows that yellow tables can also depend on each other and therefore the order in which yellow tables are processed is also relevant:

`contexts` (blue) -> `contextual_layers` (yellow) -> `carto_layers` (yellow)

For each blue table, truncate the local table and copy the remote table into it. Next, if there are any yellow tables that depend on this blue table, they need to be restored from backup. Restoring consists of the following steps:
- if there are any obsolete rows in the yellow tables backup, remove them first. To determine which rows are obsolete we match rows on foreign keys, which can be of two types: blue and yellow (depending on which parent table is concerned). The rule is, yellow foreign keys are stable (those ids do not change) and blue foreign keys are unstable. To match obsolete rows by blue foreign keys we need to do a lookup on the mapping table.
- if there are any blue foreign keys in the yellow table, they need to be resolved in the remaining rows by replacing them with new values from respective mapping tables
- finally, the yellow table with removed obsolete rows and resolved foreign keys can be restored from backup

To sum up, these are the important helper methods that need to be defined in models for the import process to run correctly:
- `import_key` - for blue tables only. Used for matching rows from local table with remote. Exception: `flows`. That table does not lend itself very well to matching in this way, which is why the `import_key` is empty. That results with the table being copied without any hope of resolving the old identifiers against the new ones. For now that is not a problem, because we do not have any yellow tables depending on flows. If we have any, this needs to be considered and matching on `context_id`, `year` and `path` implemented.
- `blue_foreign_keys` - for both blue and yellow tables. Used to inform the importer that identifiers needs to be resolved using the mapping tables.
- `yellow_foreign_keys` - for yellow tables only. Allows the importer to check for any rows that depend on another yellow table and might need removing.

### Starting the importer

The importer can be started in two ways:
- via a rake task: `bundle exec rake db:remote:import`
- via the admin interface: `/content/admin/database_update`

In the first case the importer will run synchronously. In the latter case it will be executed as a background job using sidekiq. For that to work you need redis & sidekiq running. If redis is not already running it can be started using `redis-server`. To start sidekiq in development run `bundle exec sidekiq`. In staging / demo / production starting and stopping sidekiq is handled by capistrano.

## Data validation process

In order to help with correct configuration of the tool (the configuration is the metadata stored in the "yellow tables"), we have a validation tool which inspect the entire system, especially at the cross-section of "blue" and "yellow" tables, and creates a report with all anomalies it detected. That can be used to amend the configuration using the admin tool.

The output of the validation tool, which can be downloaded from the admin interface, is currently a pretty-formatted json, a collection of error objects. This is what a sample error looks like:

```
  {
    "table": "contexts",
    "id": 4,
    "type": "Api::V3::DatabaseValidation::Checks::HasAtLeastOne",
    "link": "/content/admin/map_attributes",
    "severity": "error",
    "message": "At least one map_attribute should be present"
  },
```
It means that while checking context with id=4 it detected there are no map attributes defined for it. It gives the link to the admin tool where it can be fixed.

There are two severity levels, `error` and `warn`, to indicate where we think we've encountered a misconfiguration which has a potential of breaking things vs a potentially missing optional configuration.

This is another type of error, which is a wrapper over existing Active Record validations in models:

```
  {
    "table": "context_properties",
    "id": 50,
    "type": "Api::V3::DatabaseValidation::Checks::ActiveRecordCheck",
    "link": "/content/admin/context_properties/50/edit",
    "severity": "error",
    "message": "Default basemap is not included in the list"
  },
```

There are two ways to add a new validation:
- if it is a validation that relates to a single "yellow" table, best to add it to the Active Record model and it should be picked up automatically
- if it is a validation that involves more than one table, it is likely that adding it to the model will make the admin tool unusable or difficult to use with update operations being blocked without the means to resolve the blocker. E.g. if we want to validate that a `contextual_layer` has at least one `carto_layer`, we'd need to change the admin tool so that it's possible to create / update both types of object at same time, otherwise it becomes impossible to add a `contextual_layer`. In such cases, as well as in case of validations that run with `warn` severity, add a custom one.

The custom validators are defined in app/services/api/v3/database_validation. This is the contents of this directory:

```
.
├── chain_builders
│   ├── abstract_chain_builder.rb
│   ├── context_chain_builder.rb
│   ├── context_node_type_chain_builder.rb
│   ├── contextual_layer_chain_builder.rb
│   ├── country_chain_builder.rb
│   ├── download_attribute_chain_builder.rb
│   ├── ind_chain_builder.rb
│   ├── map_attribute_chain_builder.rb
│   ├── qual_chain_builder.rb
│   ├── quant_chain_builder.rb
│   ├── recolor_by_attribute_chain_builder.rb
│   └── resize_by_attribute_chain_builder.rb
├── checks
│   ├── abstract_check.rb
│   ├── active_record_check.rb
│   ├── attribute_present.rb
│   ├── declared_temporal_matches_data.rb
│   ├── declared_years_match_data.rb
│   ├── has_at_least_one.rb
│   ├── has_at_least_one_profile.rb
│   ├── has_exactly_one.rb
│   ├── has_exactly_one_of.rb
│   └── required_node_types_present.rb
├── errors_list.rb
└── report.rb
```

In case of the custom validations, the core class is the `Api::V3::DatabaseValidation::Report`, which builds a "chain" of checks to be run, then runs them by calling `passing?` on each of them and constructs the list of errors, which gets saved in the database. Chain builders are used to construct parts of the chain relevant to a particular resource.

# Frontend

The frontend application can be found inside the `frontend` folder. All files mentioned below can be found inside this folder,
and command instructions should be executed inside the `frontend` folder.

## About this application

This project consists of only the frontend application for the TRASE website.
All data displayed is loaded through requests to the TRASE API.

This project mainly uses D3 and Leaflet, plus Redux for managing app state.
More on the stack [here](https://github.com/Vizzuality/TRASE-frontend/issues/9)

Besides the frontend code, the project also includes a standalone nodejs web server, which should be used only for
development purposes


## Lexicon

```
+-------+             +-------+
|       |             |       |
|       |             |       |
+-------+ ---\        |       |
| node  |     \-------+-------+
+-------+--\  link    | node  |
|       |   \         |       |
|       |    \--------+-------+
|       |             |       |   
+-------+             +-------+
  column                column

```

## Configuration

The project's main configuration values can be set using [environment variables](https://en.wikipedia.org/wiki/Environment_variable)

* PORT: port used by the development web server. defaults to 8081
* NODE_ENV: environment used by the nodejs tasks
* API_V3_URL: URL of the data API V3
* API_CMS_URL: URL of the homepage stories API
* API_STORY_CONTENT: URL of the deep dive stories API
* API_SOCIAL: URL of the tweets API
* GOOGLE_ANALYTICS_KEY: API key for Google Analytics
* USER_REPORT_KEY: API key for User Report
* DATA_FORM_ENABLED: enable contact form in Data page
* DATA_FORM_ENDPOINT: end point to send form values in Data page
* PDF_DOWNLOAD_URL: end point to download a PDF snapshot of the page
* PERF_TEST: when set to true, enables performance evaluation mode. Only supported outside of production environments. See https://github.com/garbles/why-did-you-update for more info.
* REDUX_LOGGER_ENABLED: when set to true, enables logging redux actions on the browser's console. Only supported outside of production environments.
* USE_PLAIN_URL_STATE: when set to true, enables saving the sankey's state as a plain serialized string. Use "false" on production environments, ot use base64 encoding
* USE_CANVAS_MAP: if set to true, may use a <canvas> to render the map's choropleth layer. Actual usage may also depend on browser support.

If you are using the included development server, you can set those variables in the `.env` file (use the included `.env.sample` as an example)


## Tools to generate CARTO maps

### Generate vector map layers

This is needed when an update is needed on the map's vector layers, aka TopoJSON files used in the Leaflet map, for instance when adding countries or subnational entities, or when needing an extra column, etc. A CARTO API key is not needed to run this.

Vector layers are generated with one of the two workflows:
- CARTO (remote DB) -> geoJSON -> topoJSON
- local shapefiles -> geoJSON -> topoJSON

All can be generated by running:
```
cd frontend
./gis/vector_maps/getVectorMaps.sh
```

All dependencies should be installed by npm install, except ogr2ogr (used for shapefile conversion), which you have to install globally with GDAL.

#### Generate municipalities by state TopoJSON files (only for Brazil for now)

Those are the maps used by D3 in place profile pages.

```
cd frontend
./gis/vector_maps/main.sh
```


### generate CARTO named maps (context layers)

This is necessary when context maps stored in CARTO tables need to be updated. A CARTO API key is needed.

- Copy CARTO credentials:
```
cd frontend
cp ./gis/cartodb/cartodb-config.sample.json ./gis/cartodb/cartodb-config.json
```
- Replace api_key value in `cartodb-config.json`
- To update or instantiate context layers run
```
cd frontend
./gis/getContextMaps.sh
```
This will use the layers configuration stored in `frontend/gis/cartodb/templates.json`, to create a named map for each item. Then, a JS file to be used by the front-end is created at `cd frontend/scripts/actions/map/context_layers_carto.js`. This file contains the unique name for the created template as well as the layergroupid. The rest of the configuration (legend, title) is located in the constants.

## Production

Run `npm run build`, it will create a production-ready version of the project in `/dist`.

## Tests 
Running `npm test` will launch jest testing environment and run all tests that match `*.test.js` filename inside the `frontend/scripts` folder.


## LICENSE

[MIT](LICENSE)
