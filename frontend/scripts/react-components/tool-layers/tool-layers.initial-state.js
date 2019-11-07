import { TOOL_LAYOUT } from 'constants';

export default {
  data: {
    mapDimensions: {},
    mapVectorData: null,
    mapDimensionsGroups: [],
    mapContextualLayers: {}
  },
  highlightedNodeCoordinates: null, // TODO: this should be local state only used for map tooltip
  toolLayout: TOOL_LAYOUT.splitted,
  linkedGeoIds: [],
  mapLoading: false,
  mapView: null,
  selectedBasemap: null,
  selectedMapContextualLayers: null,
  selectedMapDimensions: null,
  sankeySize: [window.innerWidth, window.innerHeight],
  activeModal: null
};
