import { connect } from 'react-redux';
import { createNodesPanelActions } from 'react-components/nodes-panel/nodes-panel.actions';
import { createNodesPanelSelectors } from 'react-components/nodes-panel/nodes-panel.selectors';
import ImportersPanel from './importers-panel.component';

const {
  setPage,
  fetchData,
  setLoadingItems,
  setSelectedItems,
  setSelectedTab,
  getSearchResults,
  setSearchResult
} = createNodesPanelActions('importers', {
  hasTabs: true,
  hasSearch: true,
  hasMultipleSelection: true
});

const importersProps = createNodesPanelSelectors('importers', {
  hasTabs: true,
  hasSearch: true,
  hasMultipleSelection: true
});

const mapDispatchToProps = {
  setPage,
  fetchData,
  setSelectedTab,
  setLoadingItems,
  setSearchResult,
  getSearchResults,
  setSelectedItems
};

export default connect(
  importersProps,
  mapDispatchToProps
)(ImportersPanel);
