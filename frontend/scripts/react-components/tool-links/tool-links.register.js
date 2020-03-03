import reducerRegistry from 'reducer-registry';
import sagaRegistry from 'saga-registry';
import reducer from './tool-links.reducer';
import saga from './tool-links.saga';
import * as toolLinksActions from './tool-links.actions';

reducerRegistry.register('toolLinks', reducer);
sagaRegistry.register('toolLinks', saga);

export { toolLinksActions };
