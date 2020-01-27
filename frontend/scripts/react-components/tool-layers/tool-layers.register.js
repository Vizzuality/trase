import reducerRegistry from 'reducer-registry';
import sagaRegistry from 'saga-registry';
import reducer from './tool-layers.reducer';
import saga from './tool-layers.saga';

reducerRegistry.register('toolLayers', reducer);
sagaRegistry.register('toolLayers', saga);

export { setLinkedGeoIds, setMapDimensions, saveMapView } from './tool-layers.actions';
