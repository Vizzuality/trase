export default {
  data: {
    mapDimensions: {},
    mapVectorData: null,
    mapDimensionsGroups: [],
    mapContextualLayers: {}
  },
  highlightedNodeCoordinates: null, // TODO: this should be local state only used for map tooltip
  isMapVisible: false,
  linkedGeoIds: [],
  mapLoading: false,
  mapView: null,
  selectedBasemap: null,
  selectedMapContextualLayers: null,
  selectedMapDimensions: null
};
