import reducerRegistry from 'reducer-registry';
import sagaRegistry from 'saga-registry';
import reducer from './dashboard-element.reducer';
import saga from './dashboard-element.saga';
import * as dashboardElementActions from './dashboard-element.actions';

reducerRegistry.register('dashboardElement', reducer);
sagaRegistry.register('dashboardElement', saga);

export { dashboardElementActions };
