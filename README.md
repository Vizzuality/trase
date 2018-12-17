# Trase

[Trase](http://trase.earth) brings unprecedented transparency to commodity supply chains revealing new pathways towards achieving a deforestation-free economy.

![TRASE](trase-screenshot.png)

## Project structure

This repository contains the source code for the website in two technically independent applications:
- `/frontend` contains the frontend application, including a dedicated nodejs server (for dev purposes only);
- `/` contains the Rails 5.x API that serves data to the above mentioned frontend application.

While technically independent, the frontend application is heavily dependent on the API spec served by the rails application.

## Requirements

### API
- Ruby 2.4.2
- Rails 5.1+
- PostgreSQL 9.5+ with `intarray`, `tablefunc` and `postgres_fdw` extensions
- [Bundler](http://bundler.io/)
- redis >= 3
- wget
- cron

### Frontend
- Nodejs 8.2+

## Local setup

### API

We recommend managing your Ruby installation through [rvm](https://github.com/rvm/rvm). Ensure `bundler` gem is installed.

1. Install ruby libraries

    `bundle install`

2. Configure the environment

    Copy `.env.sample` to `.env` and replace the values accordingly. See the Configuration section below for more information.

3. Create the database

    Create an empty database in PostgreSQL and then import a stable database dump. If it's an earlier version than the current schema, run the migrations:

    `rake db:migrate`

4. Start the API

    `rails server`

5. Start background job processing

- `redis-server`
- `bundle exec sidekiq`

### Frontend

1. `cd` into the `frontend` folder

2. Copy `.env.sample` to `.env` and replace the values accordingly. See the Configuration section below for more information.

3. Install dependencies

    `npm install`

4. Start the development server

    `npm start`

## Configuration

The project's main configuration values can be set using [environment variables](https://en.wikipedia.org/wiki/Environment_variable) in the `.env` file.

### API

* SECRET_KEY_BASE: Rails secret key. Use a random value
* API_HOST: e.g. http://localhost:3000, https://staging.trase.earth
* POSTGRES_HOSTNAME: Hostname of your database server
* POSTGRES_DATABASE: Name of your data database
* POSTGRES_USERNAME: Username used to connect to your PostgreSQL server instance
* POSTGRES_PASSWORD: Password used to connect to your PostgreSQL server instance
* POSTGRES_PORT: Port used to connect to your PostgreSQL server instance
* MAILCHIMP_API_KEY: API key for Mailchimp mailing service
* MAILCHIMP_LIST_ID: List ID for Mailchimp mailing service
* APPSIGNAL_PUSH_API_KEY: Appsignal API key for tracking exceptions
* APPSIGNAL_APP_NAME: Appsignal App name, should be "Trase"
* APPSIGNAL_APP_ENV: Appsignal environment name
* GOLD_MASTER_HOST_V3:
* TRASE_REMOTE_HOST=localhost
* TRASE_REMOTE_PORT=5432
* TRASE_REMOTE_DATABASE=trase
* TRASE_REMOTE_SCHEMA=trase # this schema in remote database
* TRASE_REMOTE_USER=main_ro # this user defined in remote database with read-only access to trase schema
* TRASE_REMOTE_PASSWORD=
* TRASE_REMOTE_SERVER=trase_server
* TRASE_LOCAL_FDW_SCHEMA=main # this schema in local database where remote tables are mapped
* API_HOST=http://localhost:3000 # base url of API
* TRASE_LOCAL_SCHEMA=public # this schema in local database where target tables are
* INSTANCE_NAME= # string to uniquely identify instance as source of db dump, e.g. staging
* AWS_ACCESS_KEY_ID=
* AWS_SECRET_ACCESS_KEY=
* AWS_REGION=
* S3_BUCKET_NAME= # name of bucket where db dumps are stored

### Frontend

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
* SHOW_WORLD_MAP_IN_EXPLORE: if set to true, explore section will have the 2 step behavior. Setting it to false will only show the context-specific step.
* ENABLE_DASHBOARDS: if set to true, the dashboards section will be visible to end users.
* ALWAYS_DISPLAY_DASHBOARD_INFO: if set to true, the dashboards info modal will always be displayed. If set to false, it will only be displayed for new users.
* CARTO_ACCOUNT: name of the carto account where the named maps layers are hosted.
* CARTO_TOKEN: token to authenticate into carto for the named maps creation.
* NAMED_MAPS_ENV: named maps environment to use inside the app.
* ENABLE_LOGISTICS_MAP: if set to true, the logistics map section will be visible to end users.

If you are using the included development server, you can set those variables in the `.env` file (use the included `.env.sample` as an example)

## Tests

[![Build Status](https://travis-ci.org/Vizzuality/trase.svg?branch=master)](https://travis-ci.org/Vizzuality/trase)

### API

```
RAILS_ENV=test rake db:drop db:create db:structure:load
bundle exec rspec spec
```

You may also want to know about API [gold master tests](doc/trase/gold_master_tests.md)

### Frontend

Running `npm test` will launch jest testing environment and run all tests that match `*.test.js` filename inside the `frontend/scripts` folder.

## Deployment

We use [Capistrano](http://capistranorb.com/) as a deployment tool, which deploys both API and frontend application simultaneously.

To deploy, simply use:

```
cap <staging|production> deploy
```

## Git hooks

This project includes a set of git hooks that you may find useful
- Run `bundle install` when loading `Gemfile.lock` modifications from remotes
- Run `npm install` when loading `frontend/package.json` modifications from remotes
- Receive a warning when loading `.env.sample` or `frontend/.env.sample` modifications from remotes
- Run `Rubocop` and `JS Lint` before committing

To enable then, simply execute once: `bin/git/init-hooks`

## Documentation

### API

#### Database
- [full schema](https://vizzuality.github.io/trase/all_tables/)
- ["blue tables" schema](https://vizzuality.github.io/trase/blue_tables/index.html)
- [how to regenerate docs](doc/trase/automated_documentation.md)

#### More
- [Cache management](doc/trase/cache_management.md)
- [Background jobs](doc/trase/background_jobs.md)
- [Data update](doc/trase/data_update.md)

### Frontend

#### Lexicon

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

#### More
- [Generating CARTO maps](doc/trase/generating_carto_maps.md)

## LICENSE

[MIT](LICENSE)
