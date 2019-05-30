export const TOOL_LINKS__SET_FLOWS_LOADING = 'TOOL_LINKS__SET_FLOWS_LOADING';
export const TOOL_LINKS__GET_NODES_AND_COLUMNS = 'TOOL_LINKS__GET_NODES_AND_COLUMNS';
export const TOOL_LINKS__SET_NODES_AND_COLUMNS = 'TOOL_LINKS__SET_NODES_AND_COLUMNS';

export function setToolFlowsLoading(loading) {
  return {
    type: TOOL_LINKS__SET_FLOWS_LOADING,
    payload: { loading }
  };
}

export function getToolNodesAndColumns() {
  return {
    type: TOOL_LINKS__GET_NODES_AND_COLUMNS
  };
}

export function setToolNodesAndColumns(nodes, columns) {
  return {
    type: TOOL_LINKS__SET_NODES_AND_COLUMNS,
    payload: { nodes, columns }
  };
}
