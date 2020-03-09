import reducerRegistry from 'reducer-registry';
import reducer from './app.reducer';
import * as appActions from './app.actions';

reducerRegistry.register('app', reducer);

export { appActions };
