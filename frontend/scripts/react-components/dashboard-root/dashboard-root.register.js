import reducerRegistry from 'reducer-registry';
import reducer from './dashboard-root.reducer';

reducerRegistry.register('dashboardRoot', reducer);

// not ideal because you have to change in two, but still better than changing across all app
export {
  DASHBOARD_ROOT__SET_DASHBOARD_TEMPLATES,
  DASHBOARD_ROOT__SET_LOADING_DASHBOARD_TEMPLATES,
  getDashboardTemplates
} from './dashboard-root.actions';
