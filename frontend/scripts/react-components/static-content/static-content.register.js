import reducerRegistry from 'reducer-registry';
import reducer from './static-content.reducer';
import * as staticContentActions from './static-content.actions';

reducerRegistry.register('staticContent', reducer);

export { staticContentActions };
