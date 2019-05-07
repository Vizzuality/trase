import { selectExpandedNode, setSankeySearchVisibility } from 'actions/tool.actions';
import ToolSearch from 'react-components/tool/tool-search/tool-search.component';
import { connect } from 'react-redux';
import { getToolSearchNodes } from 'react-components/tool/tool-search/tool-search.selectors';

const mapStateToProps = state => {
  const { selectedContext } = state.app;
  const { selectedNodesIds, isSearchOpen, isMapVisible } = state.toolLinks;
  const searchNodes = getToolSearchNodes(state);
  return {
    selectedNodesIds,
    isSearchOpen,
    isMapVisible,
    nodes: searchNodes,
    contextId: selectedContext && selectedContext.id,
    defaultYear: selectedContext && selectedContext.defaultYear
  };
};

const mapDispatchToProps = {
  onAddNode: selectExpandedNode,
  setSankeySearchVisibility
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSearch);
