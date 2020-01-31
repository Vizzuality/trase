import reducerRegistry from 'reducer-registry';
import sagaRegistry from 'saga-registry';
import reducer from './nodes-panel.reducer';
import saga from './nodes-panel.saga';
import * as nodesPanelActions from './nodes-panel.actions';

reducerRegistry.register('nodesPanel', reducer);
sagaRegistry.register('nodesPanel', saga);

export { nodesPanelActions };
