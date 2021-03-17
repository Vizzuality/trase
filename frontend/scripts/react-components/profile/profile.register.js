import reducerRegistry from 'reducer-registry';
import reducer from './profile.reducer';
import * as profileActions from './profile.actions';

reducerRegistry.register('profile', reducer);

export { profileActions };
