import { connect } from 'react-redux';
import { createNodesPanelActions } from 'react-components/nodes-panel/nodes-panel.actions';
import { createNodesPanelSelectors } from 'react-components/nodes-panel/nodes-panel.selectors';
import ExportersPanel from './exporters-panel.component';

const {
  setPage,
  fetchData,
  setLoadingItems,
  setSelectedItems,
  setSelectedTab,
  getSearchResults,
  setSearchResult
} = createNodesPanelActions('exporters', {
  hasTabs: true,
  hasSearch: true,
  hasMultipleSelection: true
});

const exportersProps = createNodesPanelSelectors('exporters', {
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
  exportersProps,
  mapDispatchToProps
)(ExportersPanel);
