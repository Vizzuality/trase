export const TOOL_LINKS__SET_FLOWS_LOADING = 'TOOL_LINKS__SET_FLOWS_LOADING';
export const TOOL_LINKS__GET_COLUMNS = 'TOOL_LINKS__GET_COLUMNS';
export const TOOL_LINKS__SET_COLUMNS = 'TOOL_LINKS__SET_COLUMNS';
export const TOOL_LINKS__SET_NODES = 'TOOL_LINKS__SET_NODES';
export const TOOL_LINKS__SET_MORE_NODES = 'TOOL_LINKS__SET_MORE_NODES';
export const TOOL_LINKS__SET_LINKS = 'TOOL_LINKS__SET_LINKS';
export const TOOL_LINKS__SELECT_VIEW = 'TOOL_LINKS__SELECT_VIEW';
export const TOOL_LINKS__SET_IS_SEARCH_OPEN = 'TOOL_LINKS__SET_IS_SEARCH_OPEN';
export const TOOL_LINKS__COLLAPSE_SANKEY = 'TOOL_LINKS__COLLAPSE_SANKEY';
export const TOOL_LINKS__EXPAND_SANKEY = 'TOOL_LINKS__EXPAND_SANKEY';
export const TOOL_LINKS__SELECT_COLUMN = 'TOOL_LINKS__SELECT_COLUMN';
export const TOOL_LINKS__SET_SELECTED_NODES = 'TOOL_LINKS__SET_SELECTED_NODES';
export const TOOL_LINKS__HIGHLIGHT_NODE = 'TOOL_LINKS__HIGHLIGHT_NODE';
export const TOOL_LINKS__CLEAR_SANKEY = 'TOOL_LINKS__CLEAR_SANKEY';

export function setToolFlowsLoading(loading) {
  return {
    type: TOOL_LINKS__SET_FLOWS_LOADING,
    payload: { loading }
  };
}

export function getToolColumns() {
  return {
    type: TOOL_LINKS__GET_COLUMNS
  };
}

export function setToolColumns(columns) {
  return {
    type: TOOL_LINKS__SET_COLUMNS,
    payload: { columns }
  };
}

export function setToolNodes(nodes) {
  return {
    type: TOOL_LINKS__SET_NODES,
    payload: { nodes }
  };
}

export function setMoreToolNodes(nodes) {
  return {
    type: TOOL_LINKS__SET_MORE_NODES,
    payload: { nodes }
  };
}

export function setToolLinks(links, linksMeta) {
  return {
    type: TOOL_LINKS__SET_LINKS,
    payload: { links, linksMeta }
  };
}

export function selectView(detailedView, forcedOverview) {
  return {
    type: TOOL_LINKS__SELECT_VIEW,
    payload: {
      detailedView,
      forcedOverview
    }
  };
}

export function setIsSearchOpen(isSearchOpen) {
  return {
    type: TOOL_LINKS__SET_IS_SEARCH_OPEN,
    payload: { isSearchOpen }
  };
}

export function collapseSankey() {
  return {
    type: TOOL_LINKS__COLLAPSE_SANKEY
  };
}

export function expandSankey() {
  return {
    type: TOOL_LINKS__EXPAND_SANKEY
  };
}

export function selectColumn(columnIndex, columnId) {
  return {
    type: TOOL_LINKS__SELECT_COLUMN,
    payload: {
      columnId,
      columnIndex
    }
  };
}

export function setSelectedNodes(selectedNodesIds) {
  return dispatch => {
    dispatch({
      type: TOOL_LINKS__SET_SELECTED_NODES,
      payload: { selectedNodesIds }
    });
  };
}

export function highlightNode(nodeId, coordinates) {
  return {
    type: TOOL_LINKS__HIGHLIGHT_NODE,
    payload: {
      coordinates,
      nodeId
    }
  };
}

export function clearSankey() {
  return {
    type: TOOL_LINKS__CLEAR_SANKEY
  };
}
