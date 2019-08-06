import {
  SET_NODE_ATTRIBUTES,
  GET_CONTEXT_LAYERS
  // GET_MAP_VECTOR_DATA,
  // SAVE_MAP_VIEW,
  // SELECT_BASEMAP,
  // SELECT_CONTEXTUAL_LAYERS,
  // TOGGLE_MAP,
  // TOGGLE_MAP_DIMENSION
} from 'react-components/tool/tool.actions';
import {
  TOOL_LAYERS__SET_MAP_DIMENSIONS,
  TOOL_LAYERS__SET_LINKED_GEOIDS
} from 'react-components/tool-layers/tool-layers.actions';
import reducer from 'react-components/tool-layers/tool-layers.reducer';
import initialState from 'react-components/tool-layers/tool-layers.initial-state';

test(SET_NODE_ATTRIBUTES, () => {
  const action = {
    type: SET_NODE_ATTRIBUTES
  };
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
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
