# Environments
The application is deployed to 4 different environments:

- **Production.** This is the public version of the app, in this environment we have the last version of data and code approved by SEI and Global Canopy. If this environment goes down, all hell breaks loose 🔥 . The deploy branch pointing to this environment is: `master`. https://trase.earth
- **Sandbox.** This is the second largest environment, it also uses a load balancer to replicate the production infrastructure. The purpose of this environment is to test the latest data, with the latest stable version of the code. Here we push new features once they're ready to be tested by the Trase team. If this environment goes down, it will affect the day-to-day work of the Trase team. The deploy branch pointing to this environment is: `develop`. https://sandbox.trase.earth
- **Staging.** This environment is using a smaller machine, with a smaller version of the database and the data. In this environment, we push our latest code after each sprint. We use this env to test new features and to share the future changes coming to sandbox and production with the rest of the Trase team. If this environment goes down–it's still bad–but probably will only affect people in Vizzuality. The deploy branch pointing to this environment is: `develop`. https://staging.trase.earth
- **Demo.** This environment is using the smallest machine. The purpose of this environment is to test experimental datasets individually. This environment, won't have all available data and layers will probably be different that in the rest of environments. If this environment goes down, it will affect data scientists on the Trase team.  The deploy branch pointing to this environment is: `develop`. https://demo.trase.earth

## Environment variables
The environment variables are separated in two files. One for the backend, and one for the frontend.:

- `trase/.env`
```
SECRET_KEY_BASE=
POSTGRES_DATABASE=
POSTGRES_HOSTNAME=
POSTGRES_USERNAME=
POSTGRES_PASSWORD=
POSTGRES_PORT=
TRASE_LOCAL_SCHEMA=
TRASE_LOCAL_FDW_SCHEMA=
TRASE_REMOTE_HOST=
TRASE_REMOTE_PORT=
TRASE_REMOTE_DATABASE=
TRASE_REMOTE_SCHEMA=
TRASE_REMOTE_USER=
TRASE_REMOTE_PASSWORD=
TRASE_REMOTE_SERVER=
MAILCHIMP_API_KEY=
MAILCHIMP_LIST_ID=
GOLD_MASTER_HOST_V1=
GOLD_MASTER_HOST_V2=
GOLD_MASTER_HOST_V3=
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
APPSIGNAL_PUSH_API_KEY=
NEW_RELIC_LICENSE_KEY=
INSTANCE_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET_NAME=
MAILER_HOST=
```
- `trase/frontend/.env`
```
PORT=
NODE_ENV=
API_V3_URL=
GOOGLE_ANALYTICS_KEY=
DATA_FORM_ENDPOINT=
USER_REPORT_KEY=
TRANSIFEX_API_KEY=
PDF_DOWNLOAD_URL=
GFW_WIDGETS_BASE_URL=

NAMED_MAPS_ENV=
CARTO_ACCOUNT=
CARTO_TOKEN=
MAPBOX_TOKEN=

REDUX_LOGGER_ENABLED=

# feature flags
USE_SERVICE_WORKER=
USE_CANVAS_MAP=
ALWAYS_DISPLAY_DASHBOARD_INFO=
DATA_DOWNLOAD_ENABLED=
DATA_FORM_ENABLED=
ENABLE_DASHBOARDS=
DISABLE_PROFILES=
ENABLE_LOGISTICS_MAP=
ENABLE_LEGACY_TOOL_SEARCH=
SHOW_WORLD_MAP_IN_EXPLORE=
ENABLE_COOKIE_BANNER=
ENABLE_INTERSECTION_OBSERVER=
ENABLE_VERSIONING=
ENABLE_TOOL_PANEL=
CONSOLIDATE_INSIGHTS=
ENABLE_COUNTRY_PROFILES=
```
