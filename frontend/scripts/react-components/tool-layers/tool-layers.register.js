import reducerRegistry from 'reducer-registry';
import reducer from './tool-layers.reducer';

reducerRegistry.register('toolLayers', reducer);

// not ideal because you have to change in two, but still better than changing across all app
export {
  TOOL_LAYERS__SET_LINKED_GEOIDS,
  TOOL_LAYERS__SET_MAP_DIMENSIONS,
  SET_SANKEY_SIZE,
  setLinkedGeoIds,
  setMapDimensions
} from './tool-layers.actions';
