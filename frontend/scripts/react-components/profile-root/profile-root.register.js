import reducerRegistry from 'reducer-registry';
import reducer from './profile-root.reducer';
import * as profileRootActions from './profile-root.actions';

reducerRegistry.register('profileRoot', reducer);

export { profileRootActions };
