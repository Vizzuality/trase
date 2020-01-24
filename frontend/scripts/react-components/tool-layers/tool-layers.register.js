import reducerRegistry from 'reducer-registry';
import sagaRegistry from 'saga-registry';
import reducer from './tool-layers.reducer';
import saga from './tool-layers.saga';

reducerRegistry.register('toolLayers', reducer);
sagaRegistry.register('toolLayers', saga);

// not ideal because you have to change in two, but still better than changing across all app
export {
  TOOL_LAYERS__SET_LINKED_GEOIDS,
  TOOL_LAYERS__SET_MAP_DIMENSIONS,
  SET_SANKEY_SIZE,
  setLinkedGeoIds,
  setMapDimensions
} from './tool-layers.actions';
