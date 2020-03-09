import reducerRegistry from 'reducer-registry';
import reducer from './explore.reducer';
import * as legacyExploreActions from './explore.actions';

reducerRegistry.register('legacyExplore', reducer);

export { legacyExploreActions };
