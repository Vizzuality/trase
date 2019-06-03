export const TOOL_LINKS__SET_FLOWS_LOADING = 'TOOL_LINKS__SET_FLOWS_LOADING';
export const TOOL_LINKS__GET_LINKS_AND_COLUMNS = 'TOOL_LINKS__GET_LINKS_AND_COLUMNS';
export const TOOL_LINKS__SET_LINKS_AND_COLUMNS = 'TOOL_LINKS__SET_LINKS_AND_COLUMNS';
export const TOOL_LINKS_SET_NODES = 'TOOL_LINKS_SET_NODES';

export function setToolFlowsLoading(loading) {
  return {
    type: TOOL_LINKS__SET_FLOWS_LOADING,
    payload: { loading }
  };
}

export function getToolLinksAndColumns() {
  return {
    type: TOOL_LINKS__GET_LINKS_AND_COLUMNS
  };
}

export function setToolLinksAndColumns(links, columns) {
  return {
    type: TOOL_LINKS__SET_LINKS_AND_COLUMNS,
    payload: { links, columns }
  };
}

export function setToolNodes(nodes) {
  return {
    type: TOOL_LINKS_SET_NODES,
    payload: { nodes }
  };
}
