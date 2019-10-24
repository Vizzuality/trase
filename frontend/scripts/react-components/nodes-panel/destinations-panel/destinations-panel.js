import { connect } from 'react-redux';
import { createNodesPanelActions } from 'react-components/nodes-panel/nodes-panel.actions';
import { createNodesPanelSelectors } from 'react-components/nodes-panel/nodes-panel.selectors';
import DestinationsPanel from './destinations-panel.component';

const destinationsActions = createNodesPanelActions('destinations', {
  hasSearch: true,
  hasMultipleSelection: true
});
const destinationsProps = createNodesPanelSelectors('destinations', {
  hasSearch: true,
  hasMultipleSelection: true
});

const mapDispatchToProps = {
  setPage: destinationsActions.setPage,
  fetchData: destinationsActions.fetchData,
  setSearchResult: destinationsActions.setSearchResult,
  getSearchResults: destinationsActions.getSearchResults,
  setLoadingItems: destinationsActions.setLoadingItems,
  setSelectedItems: destinationsActions.setSelectedItems
};

export default connect(
  destinationsProps,
  mapDispatchToProps
)(DestinationsPanel);
