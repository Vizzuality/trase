import { routes } from 'router/router';

// track all pages
export default Object.keys(routes).map(route => ({
  type: route,
  hitType: 'pageview'
}));
