# Service Worker

This application installs a service worker using the `sw-precache-webpack-plugin`. The service worker code, is actually a copy of the one distributed by `create-react-app`.

The main purpose of the service-worker is to cache the bundle and the assets locally, so that initial loads are faster after the second visit.

## Invalidating the service-worker
As of now, the server response headers are setting a no-cache directive to both the `index.html` and the `service-worker.js`. ⚠️  ITS PARAMOUNT THAT THIS STAYS THIS WAY. If we start caching the service-worker file or the html. A bug will occur, the app will start showing outdated code.