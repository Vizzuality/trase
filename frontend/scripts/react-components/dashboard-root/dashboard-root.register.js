import reducerRegistry from 'reducer-registry';
import reducer from './dashboard-root.reducer';
import * as dashboardRootActions from './dashboard-root.actions';

reducerRegistry.register('dashboardRoot', reducer);

export { dashboardRootActions };
