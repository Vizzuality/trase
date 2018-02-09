import { filterStateToURL } from '../../utils/stateURL';
import { toolInitialState } from '../../reducers/tool.reducer';

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

  expect(filterStateToURL(toolInitialState)).toEqual(filteredState);

  const {
    selectedResizeBy,
    selectedRecolorBy,
    selectedBiomeFilter,
    ...incompleteState // object rest assignment do not remove unused!
  } = toolInitialState;
  expect(filterStateToURL(incompleteState)).toEqual({
    ...filteredState,
    selectedResizeByName: null,
    selectedRecolorByName: null,
    selectedBiomeFilterName: null
  });
});
