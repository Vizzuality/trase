import { connect } from 'react-redux';
import ToolSearch from 'react-components/tool/tool-search/tool-search.component';
import { setIsSearchOpen, selectSearchNode } from 'react-components/tool-links/tool-links.actions';
import { getSearchResults } from 'react-components/tool/tool-search/tool-search.selectors';
import { loadSearchResults } from 'actions/app.actions';
import { getSelectedContext } from 'reducers/app.selectors';

const mapStateToProps = state => {
  const selectedContext = getSelectedContext(state);
  const { selectedNodesIds, isSearchOpen, toolLayout } = state.toolLinks;
  const searchResults = getSearchResults(state);
  return {
    selectedNodesIds,
    isSearchOpen,
    toolLayout,
    nodes: searchResults,
    contextId: selectedContext && selectedContext.id,
    openOnKeyDown: state.toolLayers.activeModal === null
  };
};

const mapDispatchToProps = {
  setIsSearchOpen,
  onAddResult: selectSearchNode,
  onInputValueChange: loadSearchResults
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolSearch);
