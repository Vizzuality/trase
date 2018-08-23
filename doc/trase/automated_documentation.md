# Automatically generated documentation

## Database documentation

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

## Ruby code documentation

Not available throughout, but recommended for new code and refactoring. We use [YARD](https://www.rubydoc.info/gems/yard/file/docs/GettingStarted.md)

## Swagger

We maintain a swagger file to document the API.
