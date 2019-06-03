export const TOOL_LINKS__SET_FLOWS_LOADING = 'TOOL_LINKS__SET_FLOWS_LOADING';
export const TOOL_LINKS__GET_COLUMNS = 'TOOL_LINKS__GET_COLUMNS';
export const TOOL_LINKS__SET_COLUMNS = 'TOOL_LINKS__SET_COLUMNS';
export const TOOL_LINKS_SET_NODES = 'TOOL_LINKS_SET_NODES';
export const TOOL_LINKS_SET_MORE_NODES = 'TOOL_LINKS_SET_MORE_NODES';
export const TOOL_LINKS_SET_LINKS = 'TOOL_LINKS_SET_LINKS';

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
    type: TOOL_LINKS_SET_NODES,
    payload: { nodes }
  };
}

export function setMoreToolNodes(nodes) {
  return {
    type: TOOL_LINKS_SET_MORE_NODES,
    payload: { nodes }
  };
}

export function setToolLinks(links, linksMeta) {
  return {
    type: TOOL_LINKS_SET_LINKS,
    payload: { links, linksMeta }
  };
}
