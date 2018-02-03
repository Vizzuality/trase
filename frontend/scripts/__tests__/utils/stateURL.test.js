import { filterStateToURL } from '../../utils/stateURL';

const initialState = {
  areNodesExpanded: false,
  choropleth: {},
  choroplethLegend: null,
  columns: [],
  contexts: [],
  currentHighlightedChoroplethBucket: null,
  currentQuant: null,
  detailedView: false,
  expandedMapSidebarGroupsIds: [],
  expandedNodesIds: [],
  forcedOverview: false,
  geoIdsDict: [],
  highlightedGeoIds: [],
  highlightedNodeCoordinates: [],
  highlightedNodeData: [],
  highlightedNodesIds: [],
  initialDataLoading: false,
  isMapVisible: false,
  linkedGeoIds: [],
  links: [],
  linksLoading: false,
  mapContextualLayers: [],
  mapDimensions: [],
  mapDimensionsGroups: [],
  mapVectorData: null,
  mapView: null,
  nodes: [],
  nodesColoredAtColumn: null,
  nodesColoredBySelection: null,
  nodesDict: null,
  nodesDictWithMeta: [],
  recolorByNodeIds: [],
  recolorGroups: [],
  selectedBiomeFilter: { value: 'none', name: 'none' },
  selectedColumnsIds: [],
  selectedContext: null,
  selectedContextId: null,
  selectedMapBasemap: null,
  selectedMapContextualLayers: null,
  selectedMapDimensions: [null, null],
  selectedMapDimensionsWarnings: null,
  selectedNodesColumnsPos: [],
  selectedNodesData: [],
  selectedNodesGeoIds: [],
  selectedNodesIds: [],
  selectedRecolorBy: { type: 'none', name: 'none' },
  selectedResizeBy: { type: 'none', name: 'none' },
  selectedYears: [],
  unmergedLinks: [],
  visibleNodes: [],
  visibleNodesByColumn: []
};

test('filterStateToURL should return only URL_PARAMS_PROPS', () => {
  const filteredState = {
    selectedContextId: null,
    selectedYears: [],
    detailedView: false,
    selectedNodesIds: [],
    expandedNodesIds: [],
    areNodesExpanded: false,
    selectedColumnsIds: [],
    selectedMapDimensions: [null, null],
    isMapVisible: false,
    mapView: null,
    expandedMapSidebarGroupsIds: [],
    selectedMapContextualLayers: null,
    selectedMapBasemap: null,
    selectedResizeByName: 'none',
    selectedRecolorByName: 'none',
    selectedBiomeFilterName: 'none' // remove after merge
  };

  const completeState = { ...initialState };
  expect(filterStateToURL(completeState)).toEqual(filteredState);

  const incompleteState = {
    ...initialState,
    selectedResizeBy: undefined,
    selectedRecolorBy: undefined,
    selectedBiomeFilter: undefined
  };
  expect(filterStateToURL(incompleteState)).toEqual({
    ...filteredState,
    selectedResizeByName: null,
    selectedRecolorByName: null,
    selectedBiomeFilterName: null
  });
});
