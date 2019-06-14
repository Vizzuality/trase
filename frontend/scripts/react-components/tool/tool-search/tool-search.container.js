import { selectSearchNode } from 'react-components/tool/tool.actions';
import { setIsSearchOpen } from 'react-components/tool-links/tool-links.actions';
import ToolSearch from 'react-components/tool/tool-search/tool-search.component';
import { connect } from 'react-redux';
import { getSearchResults } from 'react-components/tool/tool-search/tool-search.selectors';
import { loadSearchResults } from 'actions/app.actions';

const mapStateToProps = state => {
  const { selectedContext } = state.app;
  const { selectedNodesIds, isSearchOpen, isMapVisible } = state.toolLinks;
  const searchResults = getSearchResults(state);
  return {
    selectedNodesIds,
    isSearchOpen,
    isMapVisible,
    nodes: searchResults,
    contextId: selectedContext && selectedContext.id,
    defaultYear: selectedContext && selectedContext.defaultYear
  };
};

const mapDispatchToProps = {
  onAddNode: selectSearchNode,
  setIsSearchOpen,
  onInputValueChange: loadSearchResults
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSearch);
