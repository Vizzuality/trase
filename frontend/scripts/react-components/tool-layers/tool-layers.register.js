import reducerRegistry from 'reducer-registry';
import sagaRegistry from 'saga-registry';
import reducer from './tool-layers.reducer';
import saga from './tool-layers.saga';
import * as toolLayersActions from './tool-layers.actions';

reducerRegistry.register('toolLayers', reducer);
sagaRegistry.register('toolLayers', saga);

export { toolLayersActions };
