import reducerRegistry from 'reducer-registry';
import reducer from './profiles.reducer';
import * as profilesActions from './profiles.actions';

reducerRegistry.register('profiles', reducer);

export { profilesActions };
