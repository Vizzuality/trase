import { connect } from 'react-redux';
import { createNodesPanelActions } from 'react-components/nodes-panel/nodes-panel.actions';
import { createNodesPanelSelectors } from 'react-components/nodes-panel/nodes-panel.selectors';
import SourcesPanel from './sources-panel.component';

const {
  setPage,
  fetchData,
  setLoadingItems,
  setSelectedItems,
  setSelectedTab,
  getSearchResults,
  setSearchResult
} = createNodesPanelActions('sources', {
  hasTabs: true,
  hasSearch: true,
  hasMultipleSelection: true
});

const mapStateToProps = state => {
  const {
    tabs,
    sources,
    page,
    loading,
    activeTab,
    searchResults,
    selectedNodesIds
  } = createNodesPanelSelectors('sources', {
    hasTabs: true,
    hasSearch: true,
    hasMultipleSelection: true
  })(state);

  return {
    tabs,
    sources,
    page,
    loading,
    activeTab,
    searchResults,
    selectedSourcesIds: selectedNodesIds
  };
};

const mapDispatchToProps = {
  setPage,
  fetchData,
  setSelectedTab,
  setLoadingItems,
  setSearchResult,
  getSearchResults,
  onSelectSource: setSelectedItems
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SourcesPanel);
