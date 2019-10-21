import castArray from 'lodash/castArray';

export const TOOL_LINKS__SET_FLOWS_LOADING = 'TOOL_LINKS__SET_FLOWS_LOADING';
export const TOOL_LINKS__GET_COLUMNS = 'TOOL_LINKS__GET_COLUMNS';
export const TOOL_LINKS__SET_COLUMNS = 'TOOL_LINKS__SET_COLUMNS';
export const TOOL_LINKS__SET_NODES = 'TOOL_LINKS__SET_NODES';
export const TOOL_LINKS__SET_LINKS = 'TOOL_LINKS__SET_LINKS';
export const TOOL_LINKS__SELECT_VIEW = 'TOOL_LINKS__SELECT_VIEW';
export const TOOL_LINKS__SET_IS_SEARCH_OPEN = 'TOOL_LINKS__SET_IS_SEARCH_OPEN';
export const TOOL_LINKS__COLLAPSE_SANKEY = 'TOOL_LINKS__COLLAPSE_SANKEY';
export const TOOL_LINKS__EXPAND_SANKEY = 'TOOL_LINKS__EXPAND_SANKEY';
export const TOOL_LINKS__SELECT_COLUMN = 'TOOL_LINKS__SELECT_COLUMN';
export const TOOL_LINKS__HIGHLIGHT_NODE = 'TOOL_LINKS__HIGHLIGHT_NODE';
export const TOOL_LINKS__CLEAR_SANKEY = 'TOOL_LINKS__CLEAR_SANKEY';
export const TOOL_LINKS__SET_SELECTED_NODES = 'TOOL_LINKS__SET_SELECTED_NODES';
export const TOOL_LINKS__SET_SELECTED_RECOLOR_BY = 'TOOL_LINKS__SET_SELECTED_RECOLOR_BY';
export const TOOL_LINKS__SET_SELECTED_RESIZE_BY = 'TOOL_LINKS__SET_SELECTED_RESIZE_BY';
export const TOOL_LINKS__SET_SELECTED_BIOME_FILTER = 'TOOL_LINKS__SET_SELECTED_BIOME_FILTER';
export const TOOL_LINKS_SET_NO_LINKS_FOUND = 'TOOL_LINKS_SET_NO_LINKS_FOUND';
export const TOOL_LINKS_RESET_SANKEY = 'TOOL_LINKS_RESET_SANKEY';
export const TOOL_LINKS__SET_MISSING_LOCKED_NODES = 'TOOL_LINKS__SET_MISSING_LOCKED_NODES';
export const TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH = 'TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH';
export const TOOL_LINKS__CHANGE_EXTRA_COLUMN = 'TOOL_LINKS__CHANGE_EXTRA_COLUMN';
export const TOOL_LINKS__SWITCH_TOOL = 'TOOL_LINKS__SWITCH_TOOL';

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

export function selectColumn(columnIndex, columnId, columnRole) {
  return {
    type: TOOL_LINKS__SELECT_COLUMN,
    payload: {
      columnId,
      columnIndex,
      columnRole
    }
  };
}

export function changeExtraColumn(columnId, parentColumnId, nodeId) {
  return {
    type: TOOL_LINKS__CHANGE_EXTRA_COLUMN,
    payload: {
      columnId,
      parentColumnId,
      nodeId
    }
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

export function selectNodes(ids) {
  const nodeIds = castArray(ids);
  return {
    type: TOOL_LINKS__SET_SELECTED_NODES,
    payload: { nodeIds }
  };
}

export function selectRecolorBy(recolorBy) {
  return {
    type: TOOL_LINKS__SET_SELECTED_RECOLOR_BY,
    payload: recolorBy
  };
}

export function selectResizeBy(resizeBy) {
  return {
    type: TOOL_LINKS__SET_SELECTED_RESIZE_BY,
    payload: resizeBy
  };
}

export function selectBiomeFilter(name) {
  return {
    type: TOOL_LINKS__SET_SELECTED_BIOME_FILTER,
    payload: { name }
  };
}

export function setNoLinksFound(noLinksFound) {
  return {
    type: TOOL_LINKS_SET_NO_LINKS_FOUND,
    payload: { noLinksFound }
  };
}

export function resetSankey() {
  return {
    type: TOOL_LINKS_RESET_SANKEY
  };
}

export function setMissingLockedNodes(nodes) {
  return {
    type: TOOL_LINKS__SET_MISSING_LOCKED_NODES,
    payload: { nodes }
  };
}

export function selectSearchNode(results) {
  return {
    type: TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH,
    payload: { results }
  };
}

export function goToProfileFromSankey({ profileType, ...query }) {
  return {
    type: 'profileNode',
    payload: {
      query,
      profileType
    }
  };
}

export function switchTool({ section }) {
  return {
    type: 'tool',
    payload: {
      section
    }
  };
}
