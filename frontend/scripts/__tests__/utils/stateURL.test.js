import { filterStateToURL } from '../../utils/stateURL';
import { toolInitialState } from '../../reducers/tool.reducer';

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
  selectedBiomeFilterName: 'none'
};

test('filterStateToURL with existing selectedR---By as none', () => {
  expect(filterStateToURL(toolInitialState)).toEqual(filteredState);
});

test('filterStateToURL with existing selectedR---By as undefined', () => {
  const {
    selectedResizeBy,
    selectedRecolorBy,
    selectedBiomeFilter,
    ...incompleteState // object rest assignment do not remove unused!
  } = toolInitialState;

  expect(filterStateToURL(incompleteState)).toEqual({
    ...filteredState,
    selectedResizeByName: undefined,
    selectedRecolorByName: undefined,
    selectedBiomeFilterName: undefined
  });
});
