# Architecture
Trase is a project built using Postgres, and Ruby on Rails in the backend; React and Redux in the frontend. The architecture can be divided into the following layers:

## Database (Model)
The database that holds all of the data and the model of the flows of commodities and countries and all intermediate nodes. This database is maintained by SEI and is not directly connected to the application.

## Database (Frontend)
The database that holds the data needed by the web application, maintained by Vizzuality. This database connects to the Model database and copies the necessary data, then it makes necessary transformations and optimisations so that the RoR backend can consume it. This database also holds all the static content and necessary configurations to tweak how the data is displayed in the frontend SPA.

## API Backend (RoR)
The backend that exposes the frontend database to the web app. It creates REST endpoints for the browser to consume. This backend handles the querying of data, creating and updating configurations, adding static content.

## Nginx + Varnish
Nginx is used as web server by the RoR backend and Varnish is used as a cache to optimise the backend endpoints.

## Webshot (NodeJS)
Webshot is a dedicated service to make profiles PDF download possible. It uses Node and PuppeteerJS.

## Apache2
Apache2 is used as a web server to serve the frontend statics and frontend build. It also handles internal routing to the API, and Webshot services..

Here we handle the static assets and frontend build response headers. This is *IMPORTANT* ™️ , because here we set the cache-control for the build and service-worker. Also here we used to redirect IE11 users to a splash page that showed a message saying we dont support it, but now that's going away.

For long term caching, we set the javascript files `cache-control` to 1 year, we name each file using a hash that's generated based on the content of the file, that way we can cache bust when needed.

For the service-worker to properly update the code, we need to set a `no-cache` directive both on the service-worker file and in the `index.html`. This is also down using Apache2.

_NOTE: if in the future we decide to move away from AWS and Apache2 setup (i.e. to use NextJS alongside Zeit's Now.sh), we will need to set up the cache-control directives for the service-worker. Otherwise, a bug will be introduced._ 

## AWS Load balancer
Load balancer takes care of routing the requests into one of the 2 machines that hold the backend. This is set so that the backend can be more performant and so that the heavy requests are handled by the biggest machine.

  - xLarge: handles expensive tasks and uses sidekiq to perform tasks in the background that update the database.
  - Large: handles the rest of the tasks.

## Frontend SPA (React)
Application that consumes data from the backend in REST format and uses React to render. The application manages state using Redux + Redux-Saga and/or Redux-Thunk depending on use case. It has basic unit tests using Jest and basic E2E tests using PuppeteerJS and PollyJS. For the data visualisations it uses custom D3 charts and also Recharts library. For the maps it uses, Leaflet (in the future we will be migrating to Mapbox) and React Simple Maps.

![excalidraw-202021312555(1)](../../Downloads/excalidraw-202021312555(1).png)
