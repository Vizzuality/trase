import { appStateToURLParams, rehydrateToolState } from '../../utils/stateURL';
import { toolInitialState } from '../../react-components/tool/tool.reducer';
import { LOAD_INITIAL_DATA } from '../../actions/tool.actions';

const filteredState = {
  selectedContextId: null,
  selectedYears: [],
  detailedView: false,
  selectedNodesIds: [],
  expandedNodesIds: [],
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

const next = x => x;

test('filterStateToURL with existing selectedR---By as none', () => {
  expect(appStateToURLParams(toolInitialState)).toEqual(filteredState);
});

test('filterStateToURL with existing selectedR---By as undefined', () => {
  const {
    selectedResizeBy,
    selectedRecolorBy,
    selectedBiomeFilter,
    ...incompleteState // object rest assignment do not remove unused!
  } = toolInitialState;

  expect(appStateToURLParams(incompleteState)).toEqual({
    ...filteredState,
    selectedResizeByName: undefined,
    selectedRecolorByName: undefined,
    selectedBiomeFilterName: undefined
  });
});

test('filterStateToUrl receives selectedNodesIds and changes to expanded mode', () => {
  const newState = { ...filteredState, selectedNodesIds: [587, 440] };
  expect(appStateToURLParams(newState)).toEqual({
    ...filteredState,
    selectedNodesIds: [587, 440],
    expandedNodesIds: [587, 440]
  });
});

test('rehydrateToolState receives no location.query.state and no location.search', () => {
  expect(rehydrateToolState({ type: LOAD_INITIAL_DATA }, next, {})).toEqual({
    type: LOAD_INITIAL_DATA
  });
});

test('rehydrateToolState generic action no location.query.state, no location.search', () => {
  expect(rehydrateToolState({ type: 'other', payload: true }, next, {})).toEqual({
    type: 'other',
    payload: true
  });
});

test('rehydrateToolState receives query.state', () => {
  const query = {
    state: { selectedNodesIds: [587, 440], expandedNodesIds: [587, 440] }
  };
  expect(rehydrateToolState({ type: LOAD_INITIAL_DATA }, next, { query })).toEqual({
    type: LOAD_INITIAL_DATA,
    payload: query.state
  });

  expect(rehydrateToolState({ type: 'other' }, next, { query })).toEqual({ type: 'other' });
});
