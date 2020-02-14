import { connect } from 'react-redux';
import ToolSearch from 'react-components/tool/tool-search/tool-search.component';
import { toolLinksActions } from 'react-components/tool-links/tool-links.register';
import { getSearchResults } from 'react-components/tool/tool-search/tool-search.selectors';
import { appActions } from 'app/app.register';
import { getSelectedContext } from 'app/app.selectors';

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
    openOnKeyDown: state.toolLayers?.activeModal === null
  };
};

const mapDispatchToProps = {
  setIsSearchOpen: toolLinksActions.setIsSearchOpen,
  onAddResult: toolLinksActions.selectSearchNode,
  onInputValueChange: appActions.loadSearchResults
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolSearch);
