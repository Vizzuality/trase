# Router
The app is using `redux-first-router` to handle SPA like navigation.

## Routes

- `home`. The home page.
- `explore`. The explore page that appears before arriving to the tool.
- `tool`. The sankey/data-view page.
- `profileRoot`. The profiles landing page
- `profileNode` The profiles page, has a param to determine if its a place or actor profile page.
- `dashboardRoot` The dashboards landing page.
- `dashboardElement` The dashboard page
- `data` The data download page
- `team` The team page, is hidden because SEI hasn't make up their mind about the content. They told us to leave it hidden until the content is ready.
- `teamMember` The team member detail page
- `about` the about pages
- `notSupportedOnMobile` the page that appears when trying to navigate to the tool or the data download in a mobile phone
- `logisticsMap` The logistics map page.
- `NOT_FOUND` The 404 page.