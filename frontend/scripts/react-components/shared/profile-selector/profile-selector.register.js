import reducerRegistry from 'reducer-registry';
import sagaRegistry from 'saga-registry';
import reducer from './profile-selector.reducer';
import saga from './profile-panel/profile-panel.saga';
import * as profileSelectorActions from './profile-selector.actions';

reducerRegistry.register('profileSelector', reducer);
sagaRegistry.register('profilePanel', saga);

export { profileSelectorActions };
