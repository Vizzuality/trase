import reducerRegistry from 'reducer-registry';
import reducer from './data-portal.reducer';
import * as dataPortalActions from './data-portal.actions';

reducerRegistry.register('data', reducer);

export { dataPortalActions };
