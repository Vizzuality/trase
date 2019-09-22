import { TOOL_LAYOUT } from 'constants';

export default {
  data: {
    mapDimensions: {},
    mapVectorData: null,
    mapDimensionsGroups: [],
    mapContextualLayers: {}
  },
  highlightedNodeCoordinates: null, // TODO: this should be local state only used for map tooltip
  toolLayout: TOOL_LAYOUT.right,
  linkedGeoIds: [],
  mapLoading: false,
  mapView: null,
  selectedBasemap: null,
  selectedMapContextualLayers: null,
  selectedMapDimensions: null
};
