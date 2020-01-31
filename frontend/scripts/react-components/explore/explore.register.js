import reducerRegistry from 'reducer-registry';
import reducer from './explore.reducer';
import * as exploreActions from './explore.actions';

reducerRegistry.register('explore', reducer);

export { exploreActions };
