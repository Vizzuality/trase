import {
  SET_NODE_ATTRIBUTES,
  GET_CONTEXT_LAYERS,
  GET_MAP_VECTOR_DATA,
  SAVE_MAP_VIEW,
  SELECT_BASEMAP,
  SELECT_CONTEXTUAL_LAYERS,
  CHANGE_LAYOUT,
  TOGGLE_MAP_DIMENSION,
  SET_SANKEY_SIZE,
  SET_ACTIVE_MODAL,
  saveMapView,
  selectContextualLayers
} from 'react-components/tool/tool.actions';
import {
  TOOL_LAYERS__SET_MAP_DIMENSIONS,
  TOOL_LAYERS__SET_LINKED_GEOIDS
} from 'react-components/tool-layers/tool-layers.actions';
import reducer from 'react-components/tool-layers/tool-layers.reducer';
import initialState from 'react-components/tool-layers/tool-layers.initial-state';
import { TOOL_LAYOUT, SANKEY_OFFSETS } from 'constants';

test(SET_NODE_ATTRIBUTES, () => {
  const action = {
    type: SET_NODE_ATTRIBUTES
  };
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(SET_ACTIVE_MODAL, () => {
  const action = {
    type: SET_ACTIVE_MODAL,
    payload: { activeModal: 'openedModal' }
  };
  const newState = reducer(initialState, action);
  expect(newState).toEqual({
    ...initialState,
    activeModal: 'openedModal'
  });
});

test(TOOL_LAYERS__SET_MAP_DIMENSIONS, () => {
  const dimensions = [
    {
      groupId: 3,
      layerAttributeId: 11,
      type: 'quant',
      uid: 'quant11'
    }
  ];
  const dimensionGroups = [
    { id: 3, name: 'Agricultural indicators' },
    { id: 1, name: 'Environmental indicators' }
  ];
  const action = {
    type: TOOL_LAYERS__SET_MAP_DIMENSIONS,
    payload: { dimensions, dimensionGroups }
  };
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

describe(TOOL_LAYERS__SET_LINKED_GEOIDS, () => {
  it('sets in linkedGeoIds an array of the nodes geoIds', () => {
    const action = {
      type: TOOL_LAYERS__SET_LINKED_GEOIDS,
      payload: { nodes: [{ id: 1, name: 'Node', geoId: 'BR-123-23' }] }
    };
    const newState = reducer(initialState, action);
    expect(newState).toMatchSnapshot();
  });

  it('sets in linkedGeoIds an empty array if there are no nodes', () => {
    const action = {
      type: TOOL_LAYERS__SET_LINKED_GEOIDS,
      payload: { nodes: [] }
    };
    const newState = reducer(initialState, action);
    expect(newState).toMatchSnapshot();
  });
});

test(GET_CONTEXT_LAYERS, () => {
  const mapContextualLayers = [
    {
      id: 10,
      identifier: 'landcover',
      isDefault: false,
      title: 'Land cover'
    }
  ];
  const action = {
    type: GET_CONTEXT_LAYERS,
    payload: { mapContextualLayers }
  };
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(GET_MAP_VECTOR_DATA, () => {
  const mapVectorData = [
    {
      id: 10,
      identifier: 'landcover',
      isDefault: false,
      title: 'Land cover'
    }
  ];
  const action = {
    type: GET_MAP_VECTOR_DATA,
    payload: { mapVectorData }
  };
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(SAVE_MAP_VIEW, () => {
  const zoom = 2;
  const latlng = { lat: -34.397, lng: 150.644 };
  const action = saveMapView(latlng, zoom);

  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(SELECT_BASEMAP, () => {
  const selectedBasemap = { id: 10 };
  const action = {
    type: SELECT_BASEMAP,
    payload: { selectedBasemap }
  };
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(SELECT_CONTEXTUAL_LAYERS, () => {
  const contextualLayers = [
    {
      id: 10,
      identifier: 'landcover',
      isDefault: false,
      title: 'Land cover'
    }
  ];
  const action = selectContextualLayers(contextualLayers);
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

describe(CHANGE_LAYOUT, () => {
  it('Changes the map layout', () => {
    const action = {
      type: CHANGE_LAYOUT,
      payload: {
        toolLayout: TOOL_LAYOUT.right
      }
    };
    const newState = reducer(initialState, action);
    expect(newState).toMatchSnapshot();
  });
});

describe(SET_SANKEY_SIZE, () => {
  it('Sets sankey size', () => {
    const action = {
      type: SET_SANKEY_SIZE
    };
    const windowInnerWidth = 1024;
    const windowInnerHeight = 768;
    const newState = reducer(initialState, action);
    expect(newState.sankeySize).toStrictEqual([
      windowInnerWidth - SANKEY_OFFSETS.splittedWidth,
      windowInnerHeight - SANKEY_OFFSETS.height
    ]);
  });
  it('Sets sankey size in map view', () => {
    const action = {
      type: SET_SANKEY_SIZE
    };
    const windowInnerWidth = 1024;
    const windowInnerHeight = 768;
    const newState = reducer({ ...initialState, toolLayout: TOOL_LAYOUT.left }, action);
    expect(newState.sankeySize).toStrictEqual([
      windowInnerWidth - SANKEY_OFFSETS.width,
      windowInnerHeight - SANKEY_OFFSETS.height
    ]);
  });
});

describe(TOGGLE_MAP_DIMENSION, () => {
  it('Remove map dimension if the dimension is selected', () => {
    const action = {
      type: TOGGLE_MAP_DIMENSION,
      payload: {
        selectedMapDimensions: ['quant95', 'quant90'],
        uid: 'quant90'
      }
    };
    const newState = reducer(initialState, action);
    expect(newState).toMatchSnapshot();
  });

  it('Add a map dimension if the dimension is not selected', () => {
    const action = {
      type: TOGGLE_MAP_DIMENSION,
      payload: {
        selectedMapDimensions: [],
        uid: 'quant90'
      }
    };
    const newState = reducer(initialState, action);
    expect(newState).toMatchSnapshot();
  });
  it('Add a map dimension in the second slot if the dimension is not selected', () => {
    const action = {
      type: TOGGLE_MAP_DIMENSION,
      payload: {
        selectedMapDimensions: ['NotEmpty'],
        uid: 'quant90'
      }
    };
    const newState = reducer(initialState, action);
    expect(newState).toMatchSnapshot();
  });
});
