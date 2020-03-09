import reducerRegistry from 'reducer-registry';
import reducer from './home.reducer';
import * as homeActions from './home.actions';

reducerRegistry.register('home', reducer);

export { homeActions };
