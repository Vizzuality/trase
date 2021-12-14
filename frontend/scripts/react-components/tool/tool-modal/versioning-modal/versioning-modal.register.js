import reducerRegistry from 'reducer-registry';
import * as versioningModalActions from './versioning-modal.actions';
import reducer from './versioning-modal.reducer';

reducerRegistry.register('methodsAndData', reducer);

export { versioningModalActions };
