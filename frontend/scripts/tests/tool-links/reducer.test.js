import initialState from 'react-components/tool-links/tool-links.initial-state';
import reducer from 'react-components/tool-links/tool-links.reducer';
import {
  TOOL_LINKS__SET_FLOWS_LOADING,
  TOOL_LINKS__SET_COLUMNS,
  TOOL_LINKS__SET_NODES,
  TOOL_LINKS__SET_MISSING_LOCKED_NODES,
  TOOL_LINKS__SET_LINKS,
  TOOL_LINKS__SELECT_VIEW,
  TOOL_LINKS__SET_IS_SEARCH_OPEN,
  TOOL_LINKS__COLLAPSE_SANKEY,
  TOOL_LINKS__EXPAND_SANKEY,
  TOOL_LINKS__SELECT_COLUMN,
  TOOL_LINKS__HIGHLIGHT_NODE,
  TOOL_LINKS__CLEAR_SANKEY,
  TOOL_LINKS__SET_SELECTED_NODES,
  TOOL_LINKS__SET_SELECTED_RECOLOR_BY,
  TOOL_LINKS__SET_SELECTED_RESIZE_BY,
  TOOL_LINKS__SET_SELECTED_BIOME_FILTER,
  TOOL_LINKS_SET_NO_LINKS_FOUND,
  TOOL_LINKS_RESET_SANKEY,
  TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH,
  setNoLinksFound,
  setIsSearchOpen,
  expandSankey,
  collapseSankey,
  highlightNode,
  selectView,
  selectResizeBy,
  selectRecolorBy,
  selectBiomeFilter,
  setToolFlowsLoading,
  resetSankey,
  clearSankey,
  setToolColumns,
  setMissingLockedNodes,
  setToolLinks,
  selectColumn,
  selectNodes,
  selectSearchNode,
  setToolNodes
} from 'react-components/tool-links/tool-links.actions';
import { SET_NODE_ATTRIBUTES } from 'react-components/tool/tool.actions';
import { SET_CONTEXT } from 'actions/app.actions';

test(TOOL_LINKS__SET_FLOWS_LOADING, () => {
  const action = setToolFlowsLoading(true);
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(TOOL_LINKS__SET_COLUMNS, () => {
  const columns = [
    { id: 1, name: 'MUNICIPALITY' },
    { id: 2, name: 'LOGISTICS HUB' },
    { id: 3, name: 'BIOMES' }
  ];
  const action = setToolColumns(columns);
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(TOOL_LINKS__SET_NODES, () => {
  const nodes = [
    { id: 1, columnId: 3, geoId: 'BR-1234' },
    { id: 2, columnId: 2, geoId: 'BR-4567' },
    { id: 3, columnId: 8, geoId: 'BR-8901' }
  ];
  const action = setToolNodes(nodes);
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

describe(`Test ${TOOL_LINKS__SET_MISSING_LOCKED_NODES}`, () => {
  const nodes = [
    { id: 1, columnId: 3, geoId: 'BR-1234' },
    { id: 2, columnId: 2, geoId: 'BR-4567' },
    { id: 3, columnId: 8, geoId: 'BR-8901' }
  ];
  const existingNodesState = {
    ...initialState,
    data: {
      ...initialState.data,
      nodes: {
        3: { id: 3, columnId: 8, geoId: 'BR-8901' },
        4: { id: 4, columnId: 2, geoId: 'BR-4321' }
      },
      nodesByColumnGeoId: {
        '8-BR-8901': 3,
        '2-BR-4321': 4
      }
    }
  };
  it(`${TOOL_LINKS__SET_MISSING_LOCKED_NODES} with initial state`, () => {
    const action = setMissingLockedNodes(nodes);
    const newState = reducer(initialState, action);
    expect(newState).toMatchSnapshot();
  });
  it(`${TOOL_LINKS__SET_MISSING_LOCKED_NODES} with existing nodes`, () => {
    const action = setMissingLockedNodes(nodes);
    const newState = reducer(existingNodesState, action);
    expect(newState).toMatchSnapshot();
  });
});

test(TOOL_LINKS__SET_LINKS, () => {
  const links = [{ id: 1, path: [12, 34, 56] }, { id: 2, path: [78, 90, 12] }];
  const linksMeta = { nodeHeights: [{ id: 1, height: 12345.34 }], quant: { name: 'VOLUME' } };
  const action = setToolLinks(links, linksMeta);
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(TOOL_LINKS__SELECT_VIEW, () => {
  const action = selectView(true, true);
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(TOOL_LINKS__SET_IS_SEARCH_OPEN, () => {
  const action = setIsSearchOpen(true);
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(TOOL_LINKS__COLLAPSE_SANKEY, () => {
  const action = collapseSankey();
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(TOOL_LINKS__EXPAND_SANKEY, () => {
  const action = expandSankey();
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

describe(TOOL_LINKS__SELECT_COLUMN, () => {
  it('changes the column without selected nodes', () => {
    const action = selectColumn(2, 3);
    const newState = reducer(initialState, action);
    expect(newState).toMatchSnapshot();
  });

  it('changes the column without selected nodes for the second time', () => {
    const state = {
      ...initialState,
      selectedColumnsIds: [undefined, undefined, 3]
    };
    const action = selectColumn(0, 4);
    const newState = reducer(state, action);
    expect(newState).toMatchSnapshot();
  });

  it('changes the column with existing selected nodes', () => {
    const state = {
      ...initialState,
      selectedColumnsIds: [undefined, undefined, 3],
      selectedNodesIds: [1234, 4567],
      expandedNodesIds: [1234, 4567],
      data: {
        ...initialState.data,
        links: [1, 2, 3],
        nodes: {
          1234: { columnId: 3 },
          4567: { columnId: 4 }
        },
        columns: {
          3: { group: 2 },
          4: { group: 0 }
        }
      }
    };
    const action = selectColumn(2, 5);
    const newState = reducer(state, action);
    expect(newState).toMatchSnapshot();
  });

  it('changes the column with non-existent selected nodes', () => {
    const state = {
      ...initialState,
      selectedColumnsIds: [undefined, undefined, 3],
      selectedNodesIds: [1234, 4567],
      expandedNodesIds: [1234, 4567],
      data: {
        ...initialState.data,
        links: [1, 2, 3],
        nodes: {
          4567: { columnId: 4 }
        },
        columns: {
          3: { group: 2 },
          4: { group: 0 }
        }
      }
    };
    const action = selectColumn(2, 5);
    const newState = reducer(state, action);
    expect(newState).toMatchSnapshot();
  });
});

test(TOOL_LINKS__HIGHLIGHT_NODE, () => {
  const action = highlightNode(1234);
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(TOOL_LINKS__CLEAR_SANKEY, () => {
  const action = clearSankey();
  const state = {
    ...initialState,
    selectedBiomeFilterName: 'MY_BIOME',
    detailedView: true,
    forcedOverview: true,
    highlightedNodeId: 1234,
    selectedNodesIds: [1234, 5678],
    expandedNodesIds: [1234, 5678, 9101]
  };
  const newState = reducer(state, action);
  expect(newState).toMatchSnapshot();
});

test(TOOL_LINKS__SET_SELECTED_NODES, () => {
  const action = selectNodes([1234, 5678]);
  const state = {
    ...initialState,
    data: {
      ...initialState.data,
      nodes: {
        1234: { columnId: 4 },
        5678: { columnId: 5 }
      }
    }
  };
  const newState = reducer(state, action);
  expect(newState).toMatchSnapshot();
});

test(TOOL_LINKS__SET_SELECTED_RECOLOR_BY, () => {
  const action = selectRecolorBy('MY_RECOLOR_BY');
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(TOOL_LINKS__SET_SELECTED_RESIZE_BY, () => {
  const action = selectResizeBy('MY_RESIZE_BY');
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(TOOL_LINKS__SET_SELECTED_BIOME_FILTER, () => {
  const action = selectBiomeFilter('MY_BIOME');
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(TOOL_LINKS_SET_NO_LINKS_FOUND, () => {
  const action = setNoLinksFound(true);
  const newState = reducer(initialState, action);
  expect(newState).toMatchSnapshot();
});

test(TOOL_LINKS_RESET_SANKEY, () => {
  const action = resetSankey();
  const state = {
    ...initialState,
    noLinksFound: true,
    selectedRecolorByName: 'MY_RECOLOR_BY',
    selectedResizeByName: 'MY_RESIZE_BY',
    selectedBiomeFilterName: 'MY_BIOME',
    detailedView: true,
    forcedOverview: true,
    highlightedNodeId: 1234,
    selectedNodesIds: [1234, 5678],
    expandedNodesIds: [1234, 5678, 9101],
    selectedColumnsIds: [null, 3]
  };
  const newState = reducer(state, action);
  expect(newState).toMatchSnapshot();
});

test(SET_CONTEXT, () => {
  const action = {
    type: SET_CONTEXT,
    payload: 1
  };
  const state = {
    ...initialState,
    selectedRecolorByName: 'MY_RECOLOR_BY',
    selectedResizeByName: 'MY_RESIZE_BY',
    selectedBiomeFilterName: 'MY_BIOME',
    detailedView: true,
    highlightedNodeId: 1234,
    selectedNodesIds: [1234, 5678],
    expandedNodesIds: [1234, 5678, 9101],
    selectedColumnsIds: [null, 3],
    data: {
      columns: {},
      nodes: {},
      links: {},
      nodeHeights: {},
      nodeAttributes: {},
      nodesByColumnGeoId: {}
    }
  };
  const newState = reducer(state, action);
  expect(newState).toMatchSnapshot();
});

describe(TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH, () => {
  it('selects 2 nodes belonging to a column selected by default, with no previously selected or expanded nodes', () => {
    const results = [{ id: 0, nodeType: 'EXPORTER' }, { id: 1, nodeType: 'IMPORTER' }];
    const state = {
      ...initialState,
      data: {
        ...initialState.data,
        columns: {
          3: { group: 1, name: 'EXPORTER', isDefault: true },
          4: { group: 2, name: 'IMPORTER', isDefault: true }
        }
      }
    };
    const action = selectSearchNode(results);
    const newState = reducer(state, action);
    expect(newState).toMatchSnapshot();
  });

  it('deselects 2 nodes belonging to a column selected by default, with no expanded nodes', () => {
    const results = [{ id: 0, nodeType: 'EXPORTER' }, { id: 1, nodeType: 'IMPORTER' }];
    const state = {
      ...initialState,
      selectedNodesIds: [0, 1],
      data: {
        ...initialState.data,
        columns: {
          3: { group: 1, name: 'EXPORTER', isDefault: true },
          4: { group: 2, name: 'IMPORTER', isDefault: true }
        }
      }
    };
    const action = selectSearchNode(results);
    const newState = reducer(state, action);
    expect(newState).toMatchSnapshot();
  });

  it('selects 2 nodes belonging to a column not selected by default, with no expanded nodes', () => {
    const results = [{ id: 5, nodeType: 'EXPORTER' }, { id: 6, nodeType: 'IMPORTER' }];
    const state = {
      ...initialState,
      selectedColumnsIds: [9, 8],
      data: {
        ...initialState.data,
        columns: {
          3: { id: 3, group: 1, name: 'EXPORTER' },
          4: { id: 4, group: 0, name: 'IMPORTER' }
        }
      }
    };
    const action = selectSearchNode(results);
    const newState = reducer(state, action);
    expect(newState).toMatchSnapshot();
  });

  it('deselect the only selected node that is also expanded', () => {
    const results = [{ id: 1, nodeType: 'EXPORTER' }];
    const state = {
      ...initialState,
      selectedNodesIds: [1],
      expandedNodesIds: [1],
      data: {
        ...initialState.data,
        columns: {
          3: { group: 1, name: 'EXPORTER', isDefault: true }
        }
      }
    };
    const action = selectSearchNode(results);
    const newState = reducer(state, action);
    expect(newState).toMatchSnapshot();
  });

  // TODO:
  // - REGRESSION TEST: selectedColumnsIds = [empty, 2, empty, empty] and select a node that has column group === 4 and column.isDefault === true
});

describe(SET_NODE_ATTRIBUTES, () => {
  it('adds node attributes', () => {
    const attributes = [
      { node_id: 1, attribute_id: 'SOY_DEFORESTATION', attribute_type: 'quant' },
      { node_id: 1, attribute_id: 'SMALLHOLDER_DOMINANCE', attribute_type: 'ind' }
    ];
    const action = {
      type: SET_NODE_ATTRIBUTES,
      payload: { data: attributes }
    };
    const newState = reducer(initialState, action);
    expect(newState).toMatchSnapshot();
  });

  it('removes node attributes', () => {
    const state = {
      ...initialState,
      data: {
        ...initialState.data,
        nodeAttributes: {}
      }
    };
    const action = {
      type: SET_NODE_ATTRIBUTES,
      payload: { data: [] }
    };
    const newState = reducer(state, action);
    expect(newState).toMatchSnapshot();
  });
});
