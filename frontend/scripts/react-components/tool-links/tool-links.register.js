import reducerRegistry from 'reducer-registry';
import sagaRegistry from 'saga-registry';
import reducer from './tool-links.reducer';
import saga from './tool-links.saga';

reducerRegistry.register('toolLinks', reducer);
sagaRegistry.register('toolLinks', saga);

// not ideal because you have to change in two, but still better than changing across all app
export {
  TOOL_LINKS__SET_FLOWS_LOADING,
  TOOL_LINKS__SET_CHARTS_LOADING,
  TOOL_LINKS__GET_COLUMNS,
  TOOL_LINKS__SET_COLUMNS,
  TOOL_LINKS__SET_NODES,
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
  TOOL_LINKS__SET_MISSING_LOCKED_NODES,
  TOOL_LINKS__SET_SELECTED_NODES_BY_SEARCH,
  TOOL_LINKS__CHANGE_EXTRA_COLUMN,
  TOOL_LINKS__SWITCH_TOOL,
  TOOL_LINKS__SET_CHARTS,
  setToolFlowsLoading,
  setToolChartsLoading,
  getToolColumns,
  setToolColumns,
  setToolNodes,
  setToolLinks,
  selectView,
  setIsSearchOpen,
  collapseSankey,
  expandSankey,
  selectColumn,
  changeExtraColumn,
  highlightNode,
  clearSankey,
  selectNodes,
  selectRecolorBy,
  selectResizeBy,
  selectBiomeFilter,
  setNoLinksFound,
  resetSankey,
  setMissingLockedNodes,
  selectSearchNode,
  goToProfileFromSankey,
  switchTool,
  setToolCharts
} from './tool-links.actions';